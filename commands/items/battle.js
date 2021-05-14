const ms = require("ms");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "BATTLE A USER!",
	usage: "!battle <@user>",
	cooldown: 15,
	async execute(message, args, _0, _1) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";

		const msg = await message.channel.send(
			`<@${mention.id}>, ${message.author.toString()} has challenged you to a battle! Accept by reacting with a ✅`
		);
		let profile;
		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });
		reactionCollector.on("collect", async () => {
			let [attack, defense, health] = await calculatePower(message.author.id);
			let [mattack, mdefense, mhealth] = await calculatePower(mention.id);
			let winner = "none";
			let loser = "none";
			let turnAuthor = true;
			while (winner == "none") {
				if (health <= 0) {
					winner = mention.id;
					loser = message.author.id;
				}
				if (mhealth <= 0) {
					winner = message.author.id;
					loser = mention.id;
				}

				if (attack == mattack && defense == mdefense && health == mhealth) {
					winner = Math.floor(Math.random()) == 0 ? `<@${mention.id}>` : message.author.toString();
				}

				if (turnAuthor) {
					let random = Math.floor(Math.random() * 100) + 1;
					if (random > mdefense) {
						mhealth -= attack;
					}
					turnAuthor = false;
				} else {
					let random = Math.floor(Math.random() * 100) + 1;
					if (random > defense) {
						health -= mattack;
					}
					turnAuthor = true;
				}
			}
			const profile = await profileModel.findOne({ userID: winner });
			const amount = calculateAmount(profile.mincoDollars + profile.bank);
			const md = await profileModel.findOne({ userID: loser }).mincoDollars;
			const inc =
				amount > md
					? {
							mincoDollars: 0,
							$inc: {
								bank: amount - md,
							},
					  }
					: {
							$inc: {
								mincoDollars: -amount,
							},
					  };
			await profileModel.findOneAndUpdate({ userID: loser }, inc);
			await profileModel.findOneAndUpdate({ userID: winner }, { mincoDollars: amount });
			message.channel.send(`The battle is over! The winner is <@${winner}>, they won ${amount} MD!`);
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

/** @param {number} amount */
async function calculateAmount(amount) {
	const randomAmount = Math.floor(Math.random() * 10) - 5;
	let divideAmount = 15;
	if (amount > 1000) {
		divideAmount = 10;
	} else if (amount > 850) {
		divideAmount = 11;
	} else if (amount > 600) {
		divideAmount = 12;
	} else if (amount > 300) {
		divideAmount = 13;
	} else if (amount > 200) {
		divideAmount = 15;
	} else if (amount > 100) {
		divideAmount = 8;
	}

	return amount / divideAmount + randomAmount;
}
