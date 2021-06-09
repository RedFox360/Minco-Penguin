const { Message } = require("discord.js");

module.exports = {
	description: "Play mafia! Chooses random people to become the sheriff, doctor, and mafia",
	/** @param {Message} message */
	execute(message) {
		const members = message.guild.members.cache.array();
		const mafia1 = members.splice(Math.floor(Math.random() * members.length), 1);
		const mafia2 = members.splice(Math.floor(Math.random() * members.length), 1);
		const sheriff = members.splice(Math.floor(Math.random() * members.length), 1);
		const doctor = members.splice(Math.floor(Math.random() * members.length), 1);
		message.channel.send(`Mafia roles sent to ${message.author.toString()}`);
		message.author.send(`Mafia: <@${mafia1[0].id}> and <@${mafia2[0].id}>`);
		message.author.send(`Doctor: <@${doctor[0].id}>`);
		message.author.send(`Sheriff: <@${sheriff[0].id}>`);
	},
};
