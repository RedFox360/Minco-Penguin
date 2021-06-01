const { Client } = require("discord.js");
/** @param {Client} client */
module.exports = (client) => {
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity("!help for help", {
		type: "PLAYING",
	});

	client.ws.on("INTERACTION_CREATE", async (interaction) => {
		const command = interaction.data.name.toLowerCase();
		const args = interaction.data.options;
		client.slashCommands.get(command).execute(client, args);
	});
};
