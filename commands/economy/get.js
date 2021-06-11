const { Message, MessageEmbed } = require("discord.js");
const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Get Minco Dollars from a user (they have to react to approve)",
	usage: "!get <@user> <amount>",
	/** @param {Message} message */
	async execute(message, args) {
		const user = message.mentions.users.first();
		if (!user) return "Mention a valid user";
		if (user.bot) return "You can't get money from a bot!";
		const am = args[1];
		if (!am) return "Enter an amount of Minco Dollars";
		let amount = parseInt(am);
		if (isNaN(amount)) return "Enter a valid number";
		const userProfile = await profileModel.findOne({ userID: user.id });
		if (amount > userProfile.mincoDollars) return `<@${user.id}> does not have ${amount} Minco Dollars in their wallet.`;
		if (amount < 0) return "You must enter a positive amount (use !gift to give money)";
		const checkM = await message.channel.send(
			new MessageEmbed()
				.setTitle("Minco Dollar Request")
				.setDescription(
					`<@${
						user.id
					}>, accept the request to give ${amount} Minco Dollars to ${message.author.toString()} by reacting with a check mark`
				)
				.setColor("GREEN")
				.setFooter("These reactions will expire in 1.5 minutes")
		);
		await checkM.react("✅");
		const filter = (reaction, u) => u.id === user.id && reaction.emoji.name === "✅";
		const collector = checkM.createReactionCollector(filter, ms("90s"));
		let onEnd = true;
		collector.on("collect", async (reaction, user) => {
			onEnd = false;
			message.channel.send("Request approved...");
			await profileModel.findOneAndUpdate(
				{ userID: user.id },
				{
					$inc: {
						mincoDollars: -amount,
					},
				}
			);
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$inc: {
						mincoDollars: amount,
					},
				}
			);
			message.channel.send("Transaction successful!").then(async (m) => {
				await m.react("💵");
			});
			collector.stop();
		});
		collector.on("end", (collected) => {
			if (onEnd) message.channel.send("Timed out...");
		});
	},
};
