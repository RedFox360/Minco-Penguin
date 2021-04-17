"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.aliases = exports.name = void 0;
exports.name = "dice";
exports.aliases = ["roll", "diceroll", "die"];
exports.description = "Roll a die (returns a random number between 1 and 6, inclusive)";
function execute() {
    var random = Math.floor(Math.random() * 6) + 1;
    return random.toString();
}
exports.execute = execute;
