const profileModel = require("../../models/profileSchema");
const { Message } = require("discord.js");
module.exports = {
	aliases: ["admindivorce", "aidendivorce"],
	description:
		"Divorce your spouse.\nThis requires a fee of 150 Minco Dollars. Your Minco Dollar money totals will be added and split between you.",
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

			return message.channel.send("You have divorced!");
		} else {
			if (profileData.spouse == null) return message.channel.send("You can't divorce if you aren't married!");
			const msg = await message.channel.send(
				`You have decided to divorce! You and <@${profileData.spouse}> will both have to pay a fee of 200 MD. Then, your Minco Dollar totals will be added up and split between you. Do you both agree?`
			);
			await msg.react("✅");
			const filter = (reaction, user) =>
				reaction.emoji.name === "✅" && (user.id == message.author.id || user.id == profileData.spouse);
			const collector = msg.createReactionCollector(filter, { time: ms("7m") });
			const spouse = profileModel.findOne({ userID: profileData.spouse });
			collector.on("collect", (reaction, user) => {
				if (reaction.emoji.name == "✅") {
					message.channel.send("You have agreed to the divorce! Paying the fee...");
					if (user.id === message.author.id) {
						await profileModel.findOneAndUpdate(
							{
								userID: message.author.id,
							},
							{
								$inc: {
									mincoDollars: -200,
								},
							}
						);
					}

					if (user.id === spouse.userID) {
						await profileModel.findOneAndUpdate(
							{
								userID: spouse.userID,
							},
							{
								$inc: {
									mincoDollars: -200,
								},
							}
						);
					}

					if (reaction.count >= 1) {
						message.channel.send("You have divorced! Your Minco Dollar totals will be split when both people agree.");

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
					if (reaction.count == 2) {
						message.channel.send("Your Minco Dollars totals will now be distributed.");

						const authorMd = profileData.mincoDollars + profileData.bank;
						const spouseMd = spouse.mincoDollars + spouse.bank;

						const distribution = (authorMd + spouseMd) / 2;

						await profileModel.findOneAndUpdate(
							{
								userID: spouse.userID,
							},
							{
								mincoDollars: distribution,
								bank: 0,
							}
						);
						await profileModel.findOneAndUpdate(
							{
								userID: message.author.id,
							},
							{
								mincoDollars: distribution,
								bank: 0,
							}
						);
					}
				}
			});
		}
	},
};
