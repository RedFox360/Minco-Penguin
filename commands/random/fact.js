const facts = require("../../functions/penguin_facts.json");
module.exports = {
	description: "Sends a random fact about penguins",
	execute() {
		var random = Math.floor(Math.random() * facts.length);
		return facts[random];
	},
};
