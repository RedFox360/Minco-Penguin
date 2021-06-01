module.exports = {
	data: {
		description: "Pings the bot",
	},
	execute(client) {
		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "pong!",
				},
			},
		});
	},
};
