const { Client, APIMessage, MessageEmbed } = require("discord.js");
/** @param {Client} client */
module.exports = (client) => {
	require("../handlers/slash_handler")(client);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity(`!help | in ${client.guilds.cache.size} servers`, {
		type: "LISTENING",
	});
	client.ws.on("INTERACTION_CREATE", async (interaction) => {
		const command = interaction.data.name.toLowerCase();
		const args = interaction.data.options;
		const p = {
			client,
			args,
			command,
			interaction,
			channel: client.channels.cache.get(interaction.channel_id),
			getArg(name) {
				return args.find((arg) => arg.name.toLowerCase() == name)?.value;
			},
			async reply(message) {
				let msg =
					message instanceof MessageEmbed
						? await createAPIMessage(interaction, client, message)
						: { content: message };
				client.api.interactions(interaction.id, interaction.token).callback.post({
					data: {
						type: 4,
						data: msg,
					},
				});
			},
		};
		require(`../slashCommands/${command}`).run(p);
	});
};
async function createAPIMessage(interaction, client, content) {
	const apiMessage = await APIMessage.create(
		client.channels.resolve(interaction.channel_id),
		content
	)
		.resolveData()
		.resolveFiles();

	return { ...apiMessage.data, files: apiMessage.files };
}
