const ms = require("ms");
const calculatePower = require("../../functions/calculatePower");
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
		msg.react("✅");
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });
		console.log(mention.id);
		console.log(message.author.id);
		reactionCollector.on("collect", async () => {
			let [attack, defense, health] = await calculatePower(message.author.id);
			let [mattack, mdefense, mhealth] = await calculatePower(mention.id);
			let winner;
			let turnAuthor = true;
			while (true) {
				if (health <= 0) {
					winner = mention.id;
					break;
				}
				if (mhealth <= 0) {
					winner = message.author.id;
					break;
				}

				if (attack == mattack && defense == mdefense && health == mhealth) {
					winner = Math.floor(Math.random()) == 0 ? mention.id : message.author.toString();
					break;
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
			const loser = winner === message.author.id ? mention.id : message.author.id;
			console.log(loser);
			console.log(winner);
			const loserProfile = await profileModel.findOne({ userID: loser });
			const md = loserProfile.mincoDollars;
			const amount = calculateAmount(md + loserProfile.bank);
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

/** @param {number} amount */
function calculateAmount(amount) {
	const randomAmount = Math.floor(Math.random() * 10) - 5;
	let divideAmount = 20;
	if (amount > 3000) {
		divideAmount = 16;
	} else if (amount > 1500) {
		divideAmount = 12;
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

	return Math.round(amount / divideAmount + randomAmount);
}
