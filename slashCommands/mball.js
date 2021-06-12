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
		let yesAnswers = [
			"Yes",
			"It is decidedly so",
			"OBVIOUSLY",
			"Undoubtedly",
			"Ofc",
			"No question!",
			"Of course!!!!",
			"Definitely",
			"Totally!",
			"YES",
			"YESSSS",
			"Yea",
			"Seriously? YES",
			"Yes, DUH",
		];
		let noAnswers = [
			"No",
			"OBVIOUSLY NO",
			"Doubtful",
			"SERIOUSLY? NO",
			"Nah",
			"...No",
			"Probably not.",
			"Are you kidding me? Definitely not.",
			"Why did you even ask that? No!",
		];
		let neutralAnswers = [
			"I am not completely sure",
			"Why did you even ask that?",
			"Sorry, I was confunded. Try again.",
			"Meh",
			"eh",
			"Ya think so?",
			"Maybe",
		];
		let yesNoN = Math.floor(Math.random() * 11);
		let color, answer;
		if (yesNoN == 0) {
			// neutral
			color = "🟡";
			answer = neutralAnswers.rand();
		} else if (yesNoN <= 5) {
			// no
			color = "🔴";
			answer = noAnswers.rand();
		} else {
			// yes
			color = "🟢";
			answer = yesAnswers.rand();
		}
		p.reply(`:8ball: | ${color} **${answer}**`);
	},
};
