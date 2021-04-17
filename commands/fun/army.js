"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
exports.name = "army";
exports.description = "This is a test command for Minco Penguin";
function execute(message, args) {
    if (args[0] != null && args[0].toLowerCase().startsWith("carl"))
        return "Turtles🐢, Dolphins🐬, Lizards🦎, Monkeys🐵🐒, Birds🦜";
    else
        return "Penguins🐧, Candy bears🍬🐻, Blobfish, Doges, Vibing Cats, Jellyfish";
}
exports.execute = execute;
