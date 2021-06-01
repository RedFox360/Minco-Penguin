const { Util } = require("discord.js");

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
	execute(p) {
		const description = p.getArg("content");
		p.reply(
			Util.cleanContent(description, {
				channel: p.channel,
				client: p.interaction.client,
			})
		);
	},
};
