const animals = require("../../functions/animals.json");
module.exports = {
	description: "Sends all the animal that you can get in the zoo",
	run(_, args) {
		const a = [];
		for (const { name, emoji } of animals) {
			if (args[0] == "list") {
				a.push(`${emoji} ${name}`);
			} else {
				a.push(emoji);
			}
		}
		return a.join(args[0] == "list" ? "\n" : "");
	},
};
