const { readdirSync } = require("fs");
const { Client } = require("discord.js");
/** @param {Client} client */
module.exports = (client) => {
	const slashFiles = readdirSync(`./slashCommands`).filter((file) => file.endsWith(".js"));
	for (const file of slashFiles) {
		const command = require(`../events/${file}`);
		const fileName = file.split(".")[0];
		client.api
			.applications(client.user.id)
			.guilds("848987165601693737")
			.commands.post({
				data: {
					name: fileName,
					...command.data,
				},
			});
	}
};
