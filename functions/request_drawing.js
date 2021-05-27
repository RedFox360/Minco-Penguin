const ms = require("ms");
const Discord = require("discord.js");

const profileModel = require("../models/profileSchema");

const { MessageCollector } = require("discord.js-collector");
module.exports =
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async (message, args, client, profileData) => {
		const claire = await client.users.fetch("802668636795830292");
		args.shift();
		var drawing = args.join(" ");
		if (!args[1]) return "Valid usage: !buy drawing <drawing>";
		let requestEmbed = new Discord.MessageEmbed()
			.setColor("#70FFC2")
			.setAuthor(message.author.username, message.author.avatarURL())
			.setTitle("Drawing Request")
			.setDescription(`${message.author.toString()} from ${message.guild.name} has requested a drawing:\n__${drawing}__`);
		let returnEmbed = new Discord.MessageEmbed()
			.setColor("#54ACFE")
			.setAuthor("Claire")
			.setTitle("Drawing Request")
			.setDescription(
				`You have succesfully sent Claire a drawing request:\n__${drawing}__\n**Reactions**\n📞: Send a message to Claire\n⛔️: cancel your request`
			);
		const reactMsgCl = await claire.send(requestEmbed);
		const reactMsgAu = await message.author.send(returnEmbed);
		message.channel.send(`Request for drawing __${drawing}__ sent to Claire.`);
		try {
			await reactMsgCl.react("✅");
			await reactMsgCl.react("🚫");
			await reactMsgCl.react("💵");
			await reactMsgCl.react("📞");
			await reactMsgAu.react("📞");
			await reactMsgAu.react("⛔");
		} catch (err) {
			console.error(err);
		}
		var reacted = false;
		var accepted = false;
		const filter = (_, user) => user.id !== "725917919292162051";
		const collector = reactMsgCl.createReactionCollector(filter, {
			time: ms("30m"),
		});
		const authorCollector = reactMsgAu.createReactionCollector(filter, {
			time: ms("30m"),
		});
		collector.on("collect", async (reaction) => {
			reacted = true;
			if (reaction.emoji.name == "🚫") {
				message.author.send("Claire has declined your request");
				claire.send(`You have declined the drawing request from ${message.author.toString()}.`);
				collector.stop();
				authorCollector.stop();
				reactMsgCl.delete();
				reactMsgAu.delete();
			} else if (reaction.emoji.name == "✅") {
				message.author.send("Claire has accepted your request");
				accepted = true;
			} else if (reaction.emoji.name == "💵") {
				if (!accepted)
					claire.send("Accept the request first before choosing a price.").then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 5000);
					});
				else {
					let botMsg = await claire.send("Choose a price :dollar:: ");
					let userMessage = await MessageCollector.asyncQuestion({
						botMessage: botMsg,
						user: "802668636795830292",
					}).catch(console.error);
					botMsg.delete();
					let price = parseInt(userMessage);
					if (isNaN(price)) claire.send("Enter a valid number");
					else {
						if (price > profileData.mincoDollars) {
							message.author.send(
								`Claire has decided on a price of ${price} dollars. However, you don't have that much money. (you can send Claire a message by using the :telephone_receiver: button)`
							);
							claire.send(
								`${message.author.toString()} doesn't have that much money. You can decide on a different price or decline the drawing request.`
							);
						}
						let confirmPriceMsg = await message.author.send(
							`Claire has decided on a price of ${price} Minco Dollars.\nReact below with a :white_check_mark: to agree and give ${price} Minco Dollars to claire.\nReact with a :no_entry_sign: if you disagree with the price.`
						);
						confirmPriceMsg
							.react("✅")
							.then(() => confirmPriceMsg.react("🚫"))
							.catch(console.error);
						const filter2 = (reaction, user) => user.id !== "725917919292162051";
						const confirmCollector = confirmPriceMsg.createReactionCollector(filter2, { time: 10000 });
						confirmCollector.on("collect", async (reaction, user) => {
							if (reaction.emoji.name == "✅") {
								await profileModel.findOneAndUpdate(
									{ userID: message.author.id },
									{
										$inc: {
											mincoDollars: -price,
										},
									}
								);
								await profileModel.findOneAndUpdate(
									{ userID: "802668636795830292" },
									{
										$inc: {
											mincoDollars: price,
										},
									}
								);
								claire.send(`${message.author.toString()} has confirmed the price. You have received ${price} Minco Dollars`);
								message.author.send(
									`You have accepted the price. ${price} Minco Dollars from your profile have been given to Claire.`
								);
							} else {
								claire.send(
									`${message.author.toString()} disagreed with the price. You can decline the request or choose a new price.`
								);
								message.author.send("You have declined the price.");
							}
							confirmPriceMsg.delete();
							confirmCollector.stop();
						});
						claire.send(`Price set to ${price} Minco Dollars`).then((msg) => {
							setTimeout(() => {
								msg.delete();
							}, 10000);
						});
					}
				}
			} else if (reaction.emoji.name == "📞") {
				let botMsg = await claire.send(`Send a message to ${message.author.toString()}...`);
				let userMessage = await MessageCollector.asyncQuestion({
					botMessage: botMsg,
					user: "802668636795830292",
				}).catch(console.error);
				await message.author.send(`Message from <@${userMessage.author.id}>: ${userMessage.content}`);
				botMsg.delete();
				claire.send("Message sent").then((msg) => {
					setTimeout(() => {
						msg.delete();
					}, 2000);
				});
			}
		});

		collector.on("end", () => {
			if (!reacted) {
				claire.send("Reactions timed out");
			}
		});

		authorCollector.on("collect", async (reaction) => {
			if (reaction.emoji.name == "📞") {
				let botMsg = await message.author.send("Send a message to Claire...");
				let userMessage = await MessageCollector.asyncQuestion({
					botMessage: botMsg,
					user: message.author.id,
				});
				await claire.send(`Message from ${message.author.toString()}: ${userMessage.content}`);
				botMsg.delete();
				message.author.send("Message Sent").then((msg) => {
					setTimeout(() => {
						msg.delete();
					}, 2000);
				});
			} else if (reaction.emoji.name == "⛔") {
				claire.send(`${message.author.toString()} has canceled the request.`);
				message.author.send("You have canceled the request");
				collector.stop();
				authorCollector.stop();
				reactMsgAu.delete();
				reactMsgCl.delete();
			}
		});
	};
