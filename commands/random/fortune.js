module.exports = {
	description: "Gives you a fortune",
	run(_, args) {
		let fortunes = [
			"For the next coming bot war, you should be on the side of Minco Penguin",
			"Thanos will come alive again and *snap*",
			"Tomorrow you will wake up with a cockroach under your pillow",
			"Your internet will break down tomorrow",
			"There will be **no** tomorrow",
			"You will grow a mustache tomorrow (if you are a boy)",
			"SIX SNOILS WILL COME TO YOUR BACKYARD AND EAT ALL YOUR PLANTS",
			"You will like broccoli",
			"You will get a pet soon",
			"You will become a trillionaire",
			"You will live on Mars when you grow up",
		];

		if (!args[0]) return fortunes.rand();
		const number = parseInt(args[0]);
		if (isNaN(number)) return "Enter a valid number";
		if (number > fortunes.length || number < 1) return "Invalid fortune index";
		return fortunes[number - 1];
	},
};
