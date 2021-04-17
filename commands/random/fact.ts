var facts = require("../../functions/penguin_facts.json");

export const name = "fact";
export const description = "Sends a random fact about penguins";
export function execute() {
	var random = Math.floor(Math.random() * facts.length);
	return facts[random];
}
