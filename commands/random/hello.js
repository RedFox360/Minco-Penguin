module.exports = {
	description: "Returns a random hello message.",
	aliases: ["howdy", "hi"],
	execute(message) {
		const mention = message.mentions.users.first();
		const ping = mention ? `<@${mention.id}>` : message.author.toString();
		const hellos = ["Hi :)", "Hai!", "Hello! :)", `Salutations, ${ping}`, "Bonjour!", `Greetings, ${ping}`, "Howdy! :cowboy:"];
		return hellos.rand();
	},
};
