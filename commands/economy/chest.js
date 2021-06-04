const { MessageEmbed } = require("discord.js");
const tips = require("../../functions/tips.json");
const serverModel = require("../../models/serverSchema");
const profileModel = require("../../models/profileSchema");
const randomInt = require("../../functions/random");
const ms = require("ms");
module.exports = {
	description: "Claim your surprise chest for the server",
	async execute(message, args, _0, _1, profileData) {
		const serverData = await serverModel.findOne({
			serverID: message.guild.id,
		});
		if (args[0] == "drop" && message.member.hasPermission("ADMINISTRATOR")) {
			if (serverData.chest?.hasChest) return "There is already a chest dropped in this server!";
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
				.setImage("https://cdn.discordapp.com/attachments/848987165601693740/850469488418750544/825185_gold_512x512.png");

			if (message.guild.id == "785642761814671381")
				surpriseEmbed.addField(":bulb: Tip", tips[Math.floor(Math.random() * tips.length)]);
			const surpriseMessage = await message.guild.systemChannel.send(surpriseEmbed);

			message.delete();

			setTimeout(async () => {
				surpriseMessage.delete();
				await serverModel.findOneAndUpdate(
					{
						serverID: message.guild.id,
					},
					{
						chest: {
							hasChest: false,
						},
					}
				);
			}, ms("10m"));
		} else if (args[0] == "claim") {
			if (message.author.id == serverData.chest?.userDropped) return "You can't claim this chest, you dropped it!";

			if (!serverData.chest?.hasChest) return "There currently isn't a chest dropped in this server";

			const mdAmount = serverData.mdAmount;
			const amount = randomInt(mdAmount - 5, mdAmount + 8);
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
			if (Math.floor(Math.random() * 5) == 0 && !profileData.inventory.includes("05")) {
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
