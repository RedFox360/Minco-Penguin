const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy items!",
	usage: "!buy <item number>",
	execute(message, args, _0, client, profileData) {
		if (args[0] == "drawing" && message.guild.id == "785642761814671381") {
			require("../../functions/request_drawing")(message, args, client, profileData);
		} else if (args[0] == "meme" && message.guild.id == "785642761814671381") {
			require("../../functions/request_meme")(message, args, client, profileData);
		} else if (args[0] == "01") {
			buy(message, "Marriage Ring :ring:", 75, "01", profileData, true, client);
		} else if (args[0] == "02") {
			buy(
				message,
				"Diamond Crown :diamond_shape_with_a_dot_inside:",
				900,
				"02",
				profileData,
				true,
				client
			);
		} else if (args[0] == "03") {
			buy(message, "Cowboy Hat :cowboy:", 25, "03", profileData, true, client);
		} else if (args[0] == "04") {
			buy(message, "Tomato :tomato:", 4, "04", profileData, false, client);
		} else if (args[0] == "05") {
			buy(message, "Candy :candy:", 10, "05", profileData, false, client);
		} else if (args[0] == "06") {
			buy(
				message,
				"Jellyfish <:transparent_jellybot:833491227995013130> ",
				75,
				"06",
				profileData,
				true,
				client
			);
		} else if (args[0] == "07") {
			buy(message, "Bear :bear:", 400, "07", profileData, true, client);
		} else if (args[0] == "08") {
			buy(message, "Cactus :cactus:", 50, "08", profileData, true, client);
		} else if (args[0] == "09") {
			buy(message, "Fire :fire:", 50, "09", profileData, true, client);
		} else if (args[0] == "10") {
			buy(
				message,
				"Lootbox <:cardboard_box:843173235549667349>",
				50,
				"10",
				profileData,
				true,
				client
			);
		} else if (args[0] == "11") {
			buy(message, "Egg :egg:", 8, "11", profileData, false, client);
		} else if (args[0] == "12") {
			buy(message, "Banana :banana:", 10, "12", profileData, false, client);
		} else return "Enter a valid item number";
	},
};

async function buy(message, item, price, itemNumber, profileData, showReaction, client) {
	if (profileData.inventory.includes(itemNumber))
		return message.channel.send("You already have this item!");
	if (profileData.mincoDollars < price)
		return message.channel.send(`You need ${price} Minco Dollars to buy this item`);
	if (showReaction) {
		const msg = await message.channel.send(`React to buy a **${item}** for ${price} MD`);
		await msg.react("✅");
		const filter = (reaction, user) =>
			reaction.emoji.name === "✅" && user.id === message.author.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
		reactionCollector.on("collect", async () => {
			await profileModel.findOneAndUpdate(
				{ userID: message.author.id },
				{
					$inc: {
						mincoDollars: -price,
					},
					$push: {
						inventory: itemNumber,
					},
				}
			);
			if (itemNumber == "02") {
				if (message.guild.id == "785642761814671381") {
					message.member.roles.add("842053621402173501");
				}
			}
			message.channel.send(`You succesfully bought a ${item}!`);
			reactionCollector.stop();
		});
	} else {
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: -price,
				},
				$push: {
					inventory: itemNumber,
				},
			}
		);
		if (itemNumber == "05") {
			await profileModel.findOneAndUpdate(
				{
					userID: message.author.id,
				},
				{
					candyAmount: 3,
				}
			);
		}
		message.channel.send(`You bought a ${item} for ${price} MD`);
	}
}
