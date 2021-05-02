module.exports = {
	description: "Returns a random hello message.",
	cooldown: 1,
	aliases: ["howdy", "hi"],
	execute(message) {
		var ping = message.author.toString();
		const mention = message.mentions.users.first();
		if (mention) ping = `<@${mention.id}>`;
		let hellos = ["Hi :)", "Hai!", "Hello! :)", `Salutations, ${ping}`, "Bonjour!", `Greetings, ${ping}`, "Howdy! :cowboy:"];
		let random = Math.floor(Math.random() * hellos.length);
		return hellos[random];
	},
};
