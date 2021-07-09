const { MessageEmbed } = require("discord.js");
const ms = require("ms");
const calculatePower = require("../../functions/calculatePower");
const profileModel = require("../../models/profileSchema");
module.exports = {
	description: "BATTLE A USER!",
	usage: "!battle <@user>",
	cooldown: 15,
	async execute(message) {
		if (!message.guild) return;
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		if (mention.bot) return "You can't battle a bot!";
		if (mention.id === message.author.id) return "You can't battle yourself!";
		let { mincoDollars, bank } = await profileModel.findOne({ userID: mention.id });
		if (mincoDollars + bank <= 0) return "You can't battle someone with no or negative money!";
		const filter = (reaction, user) => reaction.emoji.name === "✅" && user.id === mention.id;
		const msg = await message.channel.send(
			`<@${
				mention.id
			}>, ${message.author.toString()} has challenged you to a battle! Accept by reacting with a ✅`
		);
		msg.react("✅");
		const reactionCollector = msg.createReactionCollector(filter, { time: ms("3m") });
		reactionCollector.on("collect", async () => {
			let [attack, defense, health] = await calculatePower(message.author.id);
			let [mattack, mdefense, mhealth] = await calculatePower(mention.id);
			const name = message.authorName();
			message.channel.send(
				new MessageEmbed()
					.setAuthor(name, message.author.avatarURL())
					.setTitle("Battle")
					.setColor("#F5B041")
					.setDescription(`Top: ${message.author.toString()}, Bottom: <@${mention.id}>`)
					.setFooter(message.guild.name)
					.addFields(
						...getDescription(attack, defense, health),
						...getDescription(mattack, mdefense, mhealth)
					)
			);
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
			const loserProfile = await profileModel.findOne({ userID: loser });
			const md = loserProfile.mincoDollars;
			const amount = calculateAmount(md + loserProfile.bank);
			const inc =
				amount > md
					? {
							mincoDollars: 0,
							$inc: {
								bank: -(amount - md),
							},
					  }
					: {
							$inc: {
								mincoDollars: -amount,
							},
					  };
			await profileModel.findOneAndUpdate({ userID: loser }, inc);
			await profileModel.findOneAndUpdate({ userID: winner }, { $inc: { mincoDollars: amount } });
			message.channel.send(
				`The battle is over! The winner is <@${winner}>, they won ${amount} MD!`
			);
			if (Math.floor(Math.random() * 15) == 0) {
				const winnerProfile = await profileModel.findOne({ userID: winner });
				if (winnerProfile.inventory.includes("10")) return;
				await profileModel.findOneAndUpdate(
					{
						userID: winner,
					},
					{
						$push: {
							inventory: "10",
						},
					}
				);
				message.channel.send(
					`<@${winner}> also won a lootbox <:cardboard_box:843173235549667349>!`
				);
			}
		});
	},
};

/** @param {number} amount */
function calculateAmount(amount) {
	const randomAmount = Math.floor(Math.random() * 10) - 5;
	let divideAmount;
	if (amount > 10000) {
		divideAmount = 60;
	} else if (amount > 1500) {
		divideAmount = amount / 100;
	} else if (amount > 850) {
		divideAmount = 12;
	} else if (amount > 600) {
		divideAmount = 11;
	} else if (amount > 300) {
		divideAmount = 10;
	} else if (amount > 200) {
		divideAmount = 9;
	} else {
		divideAmount = 8;
	}

	return Math.round(amount / divideAmount + randomAmount);
}

function getDescription(attack, defense, health) {
	return [
		{
			name: ":fire: Attack",
			value: attack,
			inline: true,
		},
		{
			name: ":crossed_swords: Defense",
			value: defense,
			inline: true,
		},
		{
			name: ":heart: Health",
			value: health,
			inline: true,
		},
	];
}
