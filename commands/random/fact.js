var facts = require("../../functions/penguin_facts.json");
export var name = "fact";
export var description = "Sends a random fact about penguins";
export function execute() {
    var random = Math.floor(Math.random() * facts.length);
    return facts[random];
}
