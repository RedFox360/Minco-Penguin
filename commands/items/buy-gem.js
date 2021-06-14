const profileModel = require("../../models/profileSchema");
const ms = require("ms");
module.exports = {
	description: "Buy a gem!",
	usage: "!buy <gem number>",
	execute(message, args, _0, _1, profileData) {
		if (args[0] == "01") {
			buyGem(message, "Blue Diamond <:blue_diamond:843178044894216202>", 100, "01", profileData);
		} else if (args[0] == "02") {
			buyGem(message, "Pink Diamond <:pink_diamond:843177780946010132>", 150, "02", profileData);
		} else if (args[0] == "03") {
			buyGem(message, "Emerald <:emerald:843180288984219689>", 150, "03", profileData);
		} else if (args[0] == "04") {
			buyGem(message, "Gold Bar <:gold_bar:843180638705287188>", 75, "04", profileData);
		} else if (args[0] == "05") {
			buyGem(message, "Sapphire <:sapphire:843182746050232340>", 75, "05", profileData);
		} else if (args[0] == "06") {
			buyGem(message, "Ruby <:ruby:843184456025112606>", 100, "06", profileData);
		} else if (args[0] == "07") {
			buyGem(message, "Amethyst <:amethyst:843184890337296454>", 50, "07", profileData);
		} else if (args[0] == "08") {
			buyGem(message, "Black Diamond <:black_diamond:843607902136696862>", 500, "08", profileData);
		} else if (args[0] == "09") {
			buyGem(message, "Topaz <:topaz:844645993747185686>", 75, "09", profileData);
		} else if (args[0] == "10") {
			buyGem(message, "Moonstone <:moonstone:844646676337131521>", 100, "10", profileData);
		} else if (args[0] == "11") {
			buyGem(message, "Opal <:opal:844663271705280533>", 75, "11", profileData);
		} else if (args[0] == "12") {
			buyGem(message, "Quartz <:quartz:844740992473104384>", 50, "12", profileData);
		} else if (args[0] == "13") {
			buyGem(message, "Alexandrite <:alexandrite:845793544278638603>", 100, "13", profileData);
		} else if (args[0] == "14") {
			buyGem(message, "Jade <:jade:845834920903704587>", 75, "14", profileData);
		} else return "Enter a valid gem number";
	},
};

async function buyGem(message, item, price, itemNumber, profileData) {
	if (profileData.gems.includes(itemNumber))
		return message.channel.send("You already have this item!");
	if (profileData.mincoDollars < price)
		return message.channel.send(`You need ${price} Minco Dollars to buy this item`);
	const msg = await message.channel.send(`React to buy a **${item}** for ${price} MD`);
	await msg.react("✅");
	const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === message.author.id;
	const reactionCollector = msg.createReactionCollector(filter, { time: ms("30s") });
	reactionCollector.on("collect", async () => {
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: -price,
				},
				$push: {
					gems: itemNumber,
				},
			}
		);
		message.channel.send(`You succesfully bought a ${item}!`);
		reactionCollector.stop();
	});
}
