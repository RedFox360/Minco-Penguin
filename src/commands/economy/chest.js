const { MessageEmbed } = require("discord.js");
const tips = require("../../functions/tips.json");
const { default: serverModel } = require("../../models/serverSchema");
const { default: profileModel } = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const ms = require("ms");
module.exports = {
	description: "Claim your surprise chest for the server",
	async run(message, args, _0, _1, profileData, serverData) {
		if (args[0] == "drop" && message.member.hasPermission("ADMINISTRATOR")) {
			if (serverData.chest?.hasChest)
				return "There is already a chest dropped in this server!";
			const mdAmount = parseInt(args[1]);
			if (isNaN(mdAmount)) return "Enter a valid amount of MD";
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					chest: {
						hasChest: true,
						mdAmount,
						userDropped: message.author.id,
					},
				}
			);
			const surpriseEmbed = new MessageEmbed()
				.setTitle("Surprise Minco Chest Drop!")
				.setDescription(
					"Minco was feeling generous and has dropped a chest in this server. Use **!chest claim** to claim it! You only have 10 minutes to claim this chest."
				)
				.setColor("32E6C5")
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/848987165601693740/850469488418750544/825185_gold_512x512.png"
				);

			if (message.guild.id == "785642761814671381")
				surpriseEmbed.addField(":bulb: Tip", tips.rand());
			const surpriseMessage = await message.guild.systemChannel.send(
				surpriseEmbed
			);

			message.delete().catch(() => {
				// cmd runned in dm
			});

			setTimeout(async () => {
				surpriseMessage.delete();
				await serverModel.findOneAndUpdate(
					{
						serverID: message.guild.id,
					},
					{
						chest: {
							hasChest: false,
							usersClaimed: [],
						},
					}
				);
			}, ms("10m"));
		} else if (args[0] == "claim") {
			if (message.author.id == serverData.chest?.userDropped)
				return "You can't claim this chest, you dropped it!";
			if (serverData.chest.usersClaimed?.includes(message.author.id) === true)
				return "You already claimed this chest!";
			if (!serverData.chest?.hasChest)
				return "There currently isn't a chest dropped in this server";

			const { mdAmount } = serverData.chest;
			const amount = randomInt(mdAmount - 5, mdAmount + 8);
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					$push: {
						chest: {
							usersClaimed: message.author.id,
						},
					},
				}
			);
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					$inc: {
						mincoDollars: amount,
					},
				}
			);
			if (
				Math.floor(Math.random() * 5) == 0 &&
				!profileData.inventory.includes("05")
			) {
				await profileModel.findOneAndUpdate(
					{
						userID: message.author.id,
					},
					{
						$push: {
							inventory: "05",
						},
						candyAmount: 3,
					}
				);

				message.channel.send("You won a Candy :candy:!");
			}
			message.channel.send(`You won ${amount} Minco Dollars!`);
		}
	},
};
