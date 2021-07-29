module.exports = {
	description: "Curses someone with a Harry Potter curse",
	usage: "!curse <person> <Harry Potter curse>",
	/** @param {Message} message */
	run(message, args) {
		if (!args[1]) return `Valid usage: ${this.usage}`;
		var person = args[0];
		args.shift();
		var curse = args.join(" ");
		let checkCurse = curse.toLowerCase();
		if (
			checkCurse.includes("avada kedavra") ||
			checkCurse.includes("crucio") ||
			checkCurse.includes("imperio") ||
			checkCurse.includes("imperius") ||
			checkCurse.includes("cruciatus") ||
			checkCurse.includes("sectumsempra")
		)
			return "HEY! No dark magic here.";
		return `${person} was cursed by ${message.author.toString()} using the ${curse} curse`;
	},
};
