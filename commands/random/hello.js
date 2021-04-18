const { get } = require("mongoose");

module.exports = {
	description: "Returns a random hello message.",
	cooldown: 1,
	aliases: ["howdy", "hi"],
	execute(message) {
		let hellos = [
			"Hi :)",
			"Hai!",
			"Hello! :)",
			`Salutations, ${message.author.toString()}`,
			"Bonjour!",
			`Greetings, ${message.author.toString()}`,
			"Howdy! :cowboy:",
		];
		let random = Math.floor(Math.random() * hellos.length);
		return hellos[random];
	},
};
