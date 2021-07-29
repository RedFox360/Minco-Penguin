const { Message } = require("discord.js");
const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "Marry a user",
	usage: "!marry (@user)",
	/** @param {Message} message */
	async run(message, _0, _1, _2, profileData) {
		if (profileData.spouse != null) return "You are already married!";

		const user = message.mentions.users.first();
		if (!user) return "Mention a valid user!";
		if (user.bot) return "You can't marry a bot!";
		const userProfile = await profileModel.findOne({ userID: user.id });
		if (userProfile.spouse != null) return `<@${user.id}> is already married!`;

		if (user.id == message.author.id) return "You can't marry yourself, obviously";

		if (!profileData.inventory.includes("01")) return "You need to buy a ring first!";

		const marryMsg = await message.channel.send(
			`You have proposed to marry <@${user.id}>! <@${user.id}>, accept by reacting with a check mark.`
		);
		await marryMsg.react("✅");
		const filter = (reaction, u) => reaction.emoji.name === "✅" && u.id === user.id;
		const collector = marryMsg.createReactionCollector(filter, { time: ms("2m") });
		collector.on("collect", async () => {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$pull: {
						inventory: "01",
					},
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
