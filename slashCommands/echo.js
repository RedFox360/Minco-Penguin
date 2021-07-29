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
	run(p) {
		const description = p.getArg("content");
		p.reply(description);
	},
};
