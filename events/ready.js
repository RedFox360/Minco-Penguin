const { Client } = require("discord.js");
/** @param {Client} client */
module.exports = (client) => {
	require("../handlers/slash_handler")(client);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity("!help for help", {
		type: "PLAYING",
	});

	client.ws.on("INTERACTION_CREATE", async (interaction) => {
		const command = interaction.data.name.toLowerCase();
		const args = interaction.data.options;
		const p = {
			client,
			args,
			command,
			reply(message) {
				client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: {
							content: message,
						},
					},
				});
			},
		};
		require(`../slashCommands/${command}`).execute(p);
	});
};
