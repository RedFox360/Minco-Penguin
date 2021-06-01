const { MessageEmbed } = require("discord.js");

module.exports = {
	data: {
		description: "Send an embed with a title, description, and optional color",

		options: [
			{
				name: "title",
				description: "Title of the embed",
				type: 3,
				required: true,
			},
			{
				name: "description",
				description: "Description of the embed",
				type: 3,
				required: true,
			},
			{
				name: "color",
				description: "Color of the embed (default: purple)",
				type: 3,
				required: false,
			},
		],
	},

	async execute(p) {
		const title = p.getArg("title");
		const desc = p.getArg("description");
		const color = p.getArg("color") ?? "C782FE";

		const embed = new MessageEmbed().setTitle(title).setDescription(desc).setColor(color);
		p.replyEmbed(embed);
	},
};
