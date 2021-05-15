const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy items!",
	usage: "!buy <item number>",
	execute(message, args, _0, client, profileData) {
		if (args[0] == "drawing") {
			require("../../functions/request_drawing")(message, args, client, profileData);
		} else if (args[0] == "meme") {
			require("../../functions/request_meme")(message, args, client, profileData);
		} else if (args[0] == "01") {
			buy(message, "Marriage Ring :ring:", 75, "01", profileData, true, client);
		} else if (args[0] == "02") {
			buy(message, "Diamond Crown :diamond_shape_with_a_dot_inside:", 1000, "02", profileData, true, client);
		} else if (args[0] == "03") {
			buy(message, "Cowboy Hat :cowboy:", 25, "03", profileData, true, client);
		} else if (args[0] == "04") {
			buy(message, "Tomato :tomato:", 4, "04", profileData, false, client);
		} else if (args[0] == "05") {
			buy(message, "Candy :candy:", 12, "05", profileData, false, client);
		} else if (args[0] == "06") {
			buy(message, "Jellyfish <:transparent_jellybot:833491227995013130> ", 75, "06", profileData, true, client);
		} else if (args[0] == "07") {
			buy(message, "Bear :bear:", 400, "07", profileData, true, client);
		} else if (args[0] == "08") {
			buy(message, "Cactus :cactus:", 50, "08", profileData, true, client);
		} else if (args[0] == "09") {
			buy(message, "Fire :fire:", 50, "09", profileData, true, client);
		} else if (args[0] == "08") {
			buy(message, "Lootbox <:cardboard_box:843173235549667349>", 50, "10", profileData, true, client);
		} else return "Enter a valid item number";
	},
};

async function buy(message, item, price, itemNumber, profileData, showReaction, client) {
	if (profileData.inventory.includes(itemNumber)) return message.channel.send("You already have this item!");
	if (profileData.mincoDollars < price) return message.channel.send(`You need ${price} Minco Dollars to buy this item`);
	if (showReaction) {
		const msg = await message.channel.send(`React to buy a **${item}** for ${price} MD`);
		await msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
		reactionCollector.on("collect", async () => {
			message.channel.send(`Buying a ${item}...`);
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
			message.channel.send(`You succesfully bought a ${item}!`);
			if (itemNumber == "02") {
				const carrelCrew = client.guilds.cache.get("785642761814671381");
				const role = carrelCrew.roles.cache.get("842053621402173501");
				const member = carrelCrew.members.cache.get(message.author.id);
				member.roles.add(role);
			}
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
				{ userID: message.author.id },
				{
					candyAmount: 3,
				}
			);
		}
		message.channel.send(`You bought a ${item} for ${price} MD`);
	}
}
