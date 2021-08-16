const { default: serverModel } = require("../../models/serverSchema");
module.exports = {
	description:
		"[MANAGE SERVER] Toggles whether profanity is banned in the server (default: on).",
	usage: "!clean <on/off>",
	permissions: ["MANAGE_GUILD"],
	async run(message, args) {
		if (!args.length) return `Valid usage: ${this.usage}`;
		let clean;
		if (args[0] == "on") clean = true;
		else if (args[0] == "off") clean = false;
		else return `Valid usage: ${this.usage}`;

		await serverModel.findOneAndUpdate(
			{ serverID: message.guild.id },
			{ clean }
		);
		return `Clean mode set ${args[0]}`;
	},
};
