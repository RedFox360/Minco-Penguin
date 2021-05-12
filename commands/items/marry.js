const { Message } = require("discord.js");
const removeValue = require("../../functions/removeValue");
const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Marry a user",
	usage: "!marry (@user)",
	/** @param {Message} message */
	async execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.includes("01")) return message.channel.send("You need to buy a ring first!");
		const user = message.mentions.users.first();
		if (!user) return message.channel.send("Mention a valid user!");
		if (user.id == message.author.id) return message.channel.send("You can't marry yourself, obviously");
		if (user.bot) return message.channel.send("You can't marry a bot!");

		const userProfile = await profileModel.findOne({ userID: user.id });
		if (userProfile.spouse != null) return message.channel.send(`<@${user.id}> is already married!`);
		if (profileData.spouse != null) return message.channel.send("You are already married!");

		const marryMsg = await message.channel.send(
			`You have proposed to marry <@${user.id}>! <@${user.id}>, accept by reacting with a check mark.`
		);
		await marryMsg.react("✅");
		const filter = (reaction, u) => reaction.emoji.name === "✅" && u.id === user.id;
		const collector = marryMsg.createReactionCollector(filter, { time: ms("2m") });
		collector.on("collect", async () => {
			const inv = removeValue("01", profileData.inventory);

			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					inventory: inv,
					spouse: user.id,
				}
			);
			await profileModel.findOneAndUpdate(
				{ userID: user.id },
				{
					spouse: message.author.id,
				}
			);

			message.channel.send(`You have married <@${user.id}>!`);

			collector.stop();
		});
	},
};
