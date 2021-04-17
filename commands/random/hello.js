"use strict";
exports.__esModule = true;
exports.execute = exports.aliases = exports.cooldown = exports.description = exports.name = void 0;
exports.name = "hello";
exports.description = "Returns a random hello message.";
exports.cooldown = 1;
exports.aliases = ["howdy", "hi"];
function execute(message) {
    var hellos = [
        "Hi :)",
        "Hai!",
        "Hello! :)",
        "Salutations, " + message.author.toString(),
        "Bonjour!",
        "Greetings, " + message.author.toString(),
        "Howdy! :cowboy:",
    ];
    var random = Math.floor(Math.random() * hellos.length);
    return hellos[random];
}
exports.execute = execute;
