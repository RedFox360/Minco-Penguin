const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "BATTLE A USER!",
	usage: "!battle <@user>",
	cooldown: 15,
	async execute(message, args, _0, _1, profileData) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";

		const msg = await message.channel.send(
			`<@${mention.id}>, ${message.author.toString()} has challenged you to a battle! Accept by reacting with a ✅`
		);
		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });
		reactionCollector.on("collect", async () => {
			let [attack, defense, health] = await calculatePower(message.author.id);
			let [mattack, mdefense, mhealth] = await calculatePower(mention.id);
			let winner = "none";
			let turnAuthor = true;
			while (winner == "none") {
				if (health <= 0) winner = `<@${mention.id}>`;
				if (mhealth <= 0) winner = message.author.toString();

				if (attack == mattack && defense == mdefense) {
					winner = Math.floor(Math.random()) == 0 ? `<@${mention.id}>` : message.author.toString();
				}

				if (turnAuthor) {
					let random = Math.floor(Math.random() * 100) + 1;
					if (random > mdefense) {
						mhealth -= attack;
					}
					console.log("a");
					turnAuthor = false;
				} else {
					let random = Math.floor(Math.random() * 100) + 1;
					if (random > defense) {
						health -= mattack;
					}
					turnAuthor = true;
					console.log("m");
				}
				console.log(health);
				console.log(mhealth);
			}

			message.channel.send(`The battle is over! The winner is ${winner}`);
		});
	},
};

async function calculatePower(userID) {
	let attack = 0;
	let defense = 0;
	let health = 100;
	const { inventory } = await profileModel.findOne({ userID });

	if (inventory.includes("06")) attack += 12;

	if (inventory.includes("08")) defense += 8;

	await profileModel.findOneAndUpdate(
		{
			userID,
		},
		{
			battle: {
				attack,
				defense,
				health,
			},
		}
	);

	return [attack, defense, health];
}
