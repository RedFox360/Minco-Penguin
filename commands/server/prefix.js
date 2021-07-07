const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"Add a prefix or clear the prefixes of the server (pinging the bot will always be a prefix)",
	usage: "!prefix add <prefix> or !prefix reset",
	async execute(message, args) {
		if (args[0] == "add") {
			if (!args[1]) return "Enter a prefix";
			args.shift();
			const newPrefix = args.join(" ");
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					$push: {
						prefixes: newPrefix,
					},
				}
			);
			message.channel.send(`Prefix **${newPrefix}** added`);
		} else if (args[0] == "reset") {
			await serverModel.findOneAndUpdate(
				{
					serverID: message.guild.id,
				},
				{
					prefixes: [],
				}
			);
			message.channel.send("Prefixes reset");
		} else return `Valid usage: ${this.usage}`;
	},
};
