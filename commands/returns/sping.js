module.exports = {
	description: "Reacts to your message to show the bot is online",

	execute(message) {
		message.react("🏓");
	},
};
