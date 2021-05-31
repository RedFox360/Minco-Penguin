const { Client } = require("discord.js");
/** @param {Client} client */
module.exports = (client) => {
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity("!help for help", {
		type: "PLAYING",
	});

	client.api
		.applications(client.user.id)
		.guilds("848987165601693737")
		.commands.post({
			data: {
				name: "ping",
				description: "Pings the bot",
			},
		});

	client.api
		.applications(client.user.id)
		.guilds("848987165601693737")
		.commands.post({
			data: {
				name: "echo",
				description: "Echos what you say back",

				options: [
					{
						name: "content",
						description: "Content Minco will echo back",
						type: 3,
						required: true,
					},
				],
			},
		});

	client.ws.on("INTERACTION_CREATE", async (interaction) => {
		const command = interaction.data.name.toLowerCase();
		const args = interaction.data.options;

		if (command == "ping") {
			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: "pong!",
					},
				},
			});
		}

		if (command == "echo") {
			const description = args.find((arg) => arg.name.toLowerCase() == "content").value;

			client.api.interactions(interaction.id, interaction.token).callback.post({
				data: {
					type: 4,
					data: {
						content: description,
					},
				},
			});
		}
	});
};
