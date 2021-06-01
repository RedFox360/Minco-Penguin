module.exports = {
	data: {
		description: "Gives a random (definitely correct) answer to a question",

		options: [
			{
				name: "question",
				description: "Your question for the magic 8 ball",
				type: 3,
				required: false,
			},
		],
	},
	execute(p) {
		let answers = [
			[0, "Yes"],
			[2, "No"],
			[1, "I am not completely sure"],
			[0, "It is decidedly so"],
			[0, "OBVIOUSLY"],
			[2, "OBVIOUSLY No"],
			[2, "Doubtful"],
			[0, "Undoubtedly"],
			[2, "SERIOUSLY? NO"],
			[0, "Ofc"],
			[1, "Why did you even ask that?"],
			[2, "Nah"],
			[1, "Meh"],
			[0, "No question!"],
			[1, "Sorry, I was confunded. Try again."],
			[0, "Of course!!!!"],
			[0, "Definitely"],
			[2, "...No"],
			[2, "Probably not."],
			[1, "eh"],
			[2, "Are you kidding me? Definitely not."],
			[1, "Really?"],
			[1, "Ya think so?"],
			[0, "Totally!"],
			[0, "YES"],
			[0, "YESSSS"],
			[0, "Yea"],
			[0, "Seriously? YES"],
			[0, "Yes, DUH"],
		];
		let random = Math.floor(Math.random() * answers.length);
		let colors = ["🟢", "🟡", "🔴"];
		const [colorNum, answer] = answers[random];
		const color = colors[colorNum];
		p.reply(`:8ball: | ${color} **${answer}**`);
	},
};
