"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.aliases = exports.description = exports.name = void 0;
exports.name = "random";
exports.description = "Returns a random number between 2 numbers";
exports.aliases = ["rand"];
exports.usage = "!random <min number> <max number>";
function execute(_, args) {
    var min = parseInt(args[0]);
    var max = parseInt(args[1]);
    if (isNaN(min) || isNaN(max))
        return "Enter valid numbers";
    if (max < min)
        return "Your second number must be greater than your first number";
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random.toLocaleString();
}
exports.execute = execute;
