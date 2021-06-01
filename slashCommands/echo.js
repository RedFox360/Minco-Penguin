module.exports = {
	data: {
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
	execute(client, args) {
		const description = args.find((arg) => arg.name.toLowerCase() == "content").value;

		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: description,
				},
			},
		});
	},
};
