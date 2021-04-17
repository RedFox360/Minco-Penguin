"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
var facts = require("../../functions/penguin_facts.json");
exports.name = "fact";
exports.description = "Sends a random fact about penguins";
function execute() {
    var random = Math.floor(Math.random() * facts.length);
    return facts[random];
}
exports.execute = execute;
