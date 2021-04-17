import * as ms from "ms";
import * as Discord from "discord.js";

import profileModel from "../models/profileSchema";

import { MessageCollector } from "discord.js-collector";
export default async (message: Discord.Message, args, client: Discord.Client, profileData) => {
	const mason = await client.users.fetch("769313131108237322");
	var meme = "";
	for (let i = 1; i < args.length; i++) {
		meme += args[i] + " ";
	}
	if (!args[1]) return message.channel.send("Valid  export const usage =  !buy meme <meme>");
	let requestEmbed = new Discord.MessageEmbed()
		.setColor("#70FFC2")
		.setAuthor(message.author.username)
		.setTitle("Meme Request")
		.setDescription(`${message.author.toString()} from ${message.guild.name} has requested a meme:\n__${meme}__`);
	let returnEmbed = new Discord.MessageEmbed()
		.setColor("#54ACFE")
		.setAuthor("Mason L")
		.setTitle("Meme Request")
		.setDescription(
			`You have succesfully sent Mason L a meme request:\n__${meme}__\n**Reactions**\n📞: Send a message to Mason\n⛔️: cancel your request`
		);
	const reactMsgMa = await mason.send(requestEmbed);
	const reactMsgAu = await message.author.send(returnEmbed);
	message.channel.send(`Request for meme __${meme}__ sent to Mason L.`);
	try {
		await reactMsgMa.react("✅");
		await reactMsgMa.react("🚫");
		await reactMsgMa.react("💵");
		await reactMsgMa.react("📞");
		await reactMsgAu.react("📞");
		await reactMsgAu.react("⛔");
	} catch (err) {
		console.error(err);
	}
	var reacted = false;
	var accepted = false;
	const filter = (reaction, user) => user.id !== "725917919292162051";
	const collector = reactMsgMa.createReactionCollector(filter, {
		time: ms("30m"),
	});
	const authorCollector = reactMsgAu.createReactionCollector(filter, {
		time: ms("30m"),
	});
	collector.on("collect", async (reaction, user) => {
		reacted = true;
		if (reaction.emoji.name == "🚫") {
			message.author.send("Mason L has declined your request");
			mason.send(`You have declined the meme request from ${message.author.toString()}.`);
			collector.stop();
			authorCollector.stop();
			reactMsgMa.delete();
			reactMsgAu.delete();
		} else if (reaction.emoji.name == "✅") {
			message.author.send("Mason L has accepted your request");
			accepted = true;
		} else if (reaction.emoji.name == "💵") {
			if (!accepted)
				mason.send("Accept the request first before choosing a price.").then((msg) => {
					setTimeout(() => {
						msg.delete();
					} 5000);
				});
			else {
				let botMsg = await mason.send("Choose a price :dollar:: ");
				let userMessage = await MessageCollector.asyncQuestion({
					botMessage: botMsg,
					user: "769313131108237322",
				}).catch(console.error);
				botMsg.delete();
				let price = parseInt(userMessage);
				if (isNaN(price)) mason.send("Enter a valid number");
				else {
					if (price > profileData.mincoDollars) {
						message.author.send(
							`Mason L has decided on a price of ${price} dollars. However, you don't have that much money. (you can send Mason L a message by using the :telephone_receiver: button)`
						);
						mason.send(
							`${message.author.toString()} doesn't have that much money. You can decide on a different price or decline the meme request.`
						);
					}
					let confirmPriceMsg = await message.author.send(
						`Mason L has decided on a price of ${price} Minco Dollars.\nReact below with a :white_check_mark: to agree and give ${price} Minco Dollars to claire.\nReact with a :no_entry_sign: if you disagree with the price.`
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
									}
								}
							);
							await profileModel.findOneAndUpdate(
								{ userID: "769313131108237322" },
								{
									$inc: {
										mincoDollars: price,
									}
								}
							);
							mason.send(`${message.author.toString()} has confirmed the price. You have received ${price} Minco Dollars`);
							message.author.send(
								`You have accepted the price. ${price} Minco Dollars from your profile have been given to Mason L.`
							);
						} else {
							mason.send(
								`${message.author.toString()} disagreed with the price. You can decline the request or choose a new price.`
							);
							message.author.send("You have declined the price.");
						}
						confirmPriceMsg.delete();
						confirmCollector.stop();
					});
					mason.send(`Price set to ${price} Minco Dollars`).then((msg) => {
						setTimeout(() => {
							msg.delete();
						} 10000);
					});
				}
			}
		} else if (reaction.emoji.name == "📞") {
			let botMsg = await mason.send(`Send a message to ${message.author.toString()}...`);
			let userMessage = await MessageCollector.asyncQuestion({
				botMessage: botMsg,
				user: "769313131108237322",
			}).catch(console.error);
			await message.author.send(`Message from <@${userMessage.author.id}>: ${userMessage.content}`);
			botMsg.delete();
			mason.send("Message sent").then((msg) => {
				setTimeout(() => {
					msg.delete();
				} 2000);
			});
		}

		const userReactions = reactMsgMa.reactions.cache.filter((react) => react.users.cache.has("769313131108237322"));
		try {
			for (const reaction of userReactions.values()) {
				await reaction.users.remove("769313131108237322");
			}
		} catch (error) {
			console.error("Failed to remove reactions.");
		}
	});

	collector.on("end", (collected) => {
		if (!reacted) {
			mason.send("Reactions timed out");
		}
	});

	authorCollector.on("collect", async (reaction, user) => {
		if (reaction.emoji.name == "📞") {
			let botMsg = await message.author.send("Send a message to Mason L...");
			let userMessage = await MessageCollector.asyncQuestion({
				botMessage: botMsg,
				user: message.author.id,
			});
			await mason.send(`Message from ${message.author.toString()}: ${userMessage.content}`);
			botMsg.delete();
			message.author.send("Message Sent").then((msg) => {
				setTimeout(() => {
					msg.delete();
				} 2000);
			});
		} else if (reaction.emoji.name == "⛔") {
			mason.send(`${message.author.toString()} has canceled the request.`);
			message.author.send("You have canceled the request");
			collector.stop();
			authorCollector.stop();
			reactMsgAu.delete();
			reactMsgMa.delete();
		}

		const userReactions = reactMsgAu.reactions.cache.filter((react) => react.users.cache.has(message.author.id));
		try {
			for (const reaction of userReactions.values()) {
				await reaction.users.remove(message.author.id);
			}
		} catch (error) {
			console.error("Failed to remove reactions.");
		}
	});
};
