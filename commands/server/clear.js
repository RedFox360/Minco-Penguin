module.exports = {
	description: "[MANAGE MESSAGES] Clears [number] messages from a text channel",
	usage: "!clear <number>",
	execute(message, args) {
		if (message.author.id == "769313131108237322") return "You don't have the correct permissions to execute this command.";
		if (message.member.hasPermission("MANAGE_MESSAGES")) {
			if (!args[0]) return "Please enter the amount of messages that you want to clear";
			if (isNaN(args[0])) return "Please enter a valid number";
			if (args[0] > 100) return "You cannot delete more than 100 messages!";
			if (args[0] < 1) return "You must delete at least one message";
			message.channel.messages.fetch({ limit: args[0] }).then((messages) => {
				message.channel.bulkDelete(messages);
			});
		} else {
			message.channel.send("You don't have the correct permissions to execute this command.");
		}
	},
};
