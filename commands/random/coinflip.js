"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.aliases = exports.name = void 0;
exports.name = "coinflip";
exports.aliases = ["flip"];
exports.description = 'Returns "heads" or "tails" based on a random outcome.';
function execute(_, args) {
    var random = Math.floor(Math.random() * 2);
    var options = [];
    if (args[0] == "yn")
        options = [":thumbsup: Yes", ":thumbsdown: No"];
    else
        options = [":coin: Heads", ":coin: Tails"];
    return options[random];
}
exports.execute = execute;
