const profileModel = require("../../models/profileSchema");
const { Message } = require("discord.js");
module.exports = {
	aliases: ["admindivorce"],
	description: "Divorce your spouse.\nThis requires a fee of 150 Minco Dollars.",
	/** @param {Message} message */
	async execute(message, _0, cmd, _1, profileData) {
		if (message.author.id == "724786310711214118" && cmd === "admindivorce") {
			const mention = message.mentions.users.first();
			if (mention) {
				await profileModel.findOneAndUpdate(
					{
						userID: mention.id,
					},
					{
						spouse: null,
					}
				);
				message.channel.send(`You have succesfully removed the spouse of <@${mention.id}>`);
				return;
			}
			await profileModel.findOneAndUpdate(
				{
					userID: profileData.spouse,
				},
				{
					spouse: null,
				}
			);
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					spouse: null,
				}
			);

			return "You have divorced!";
		} else {
			if (profileData.spouse == null) return "You can't divorce if you aren't married!";
			if (profileData.mincoDollars < 150) return "You don't have 150 MD (fee) in your wallet.";
			const msg = await message.channel.send(
				`You have decided to divorce! You and <@${profileData.spouse}> will both have to pay a fee of 150 MD. Then, your Minco Dollar totals will be added up and split between you. Do you both agree?`
			);
			await msg.react("✅");
			const filter = (reaction, user) =>
				reaction.emoji.name === "✅" && (user.id == message.author.id || user.id == profileData.spouse);
			const collector = msg.createReactionCollector(filter, { time: ms("7m") });
			const spouse = profileModel.findOne({ userID: profileData.spouse });
			collector.on("collect", async (reaction, user) => {
				if (reaction.emoji.name == "✅") {
					message.channel.send("You have agreed to the divorce! Paying the fee...");
					if (user.id === message.author.id) {
						await profileModel.findOneAndUpdate(
							{
								userID: message.author.id,
							},
							{
								$inc: {
									mincoDollars: -150,
								},
							}
						);
					}

					message.channel.send("You have divorced!");

					await profileModel.findOneAndUpdate(
						{
							userID: spouse.userID,
						},
						{
							spouse: null,
						}
					);

					await profileModel.findOneAndUpdate(
						{
							userID: message.author.id,
						},
						{
							spouse: null,
						}
					);
				}
			});
		}
	},
};
