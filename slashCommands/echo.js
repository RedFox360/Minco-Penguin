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
		const description = p.args.find((arg) => arg.name.toLowerCase() == "content").value;
		p.reply(description);
	},
};
