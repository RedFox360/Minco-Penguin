const { Client, APIMessage } = require("discord.js");
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
			getArg(name) {
				return args.find((arg) => arg.name.toLowerCase() == name)?.value;
			},
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
			async createAPIMessage(content) {
				const apiMessage = await APIMessage.create(client.channels.resolve(interaction.channel_id), content)
					.resolveData()
					.resolveFiles();

				return { ...apiMessage.data, files: apiMessage.files };
			},
		};
		require(`../slashCommands/${command}`).execute(p);
	});
};
