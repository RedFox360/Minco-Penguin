"use strict";
exports.__esModule = true;
exports.execute = exports.aliases = exports.cooldown = exports.description = exports.name = void 0;
exports.name = "yee";
exports.description = "Sends a random yee gif";
exports.cooldown = 1;
exports.aliases = ["yeee", "yeeeee", "yeeeeee", "yeeeeeee", "yeeeeeeee", "yeeeeeeeee", "yeeeeeeeeee", "eeeeeeeeeee"];
function execute(message, args) {
    var yees = [
        "https://tenor.com/view/yee-yeedinasour-dinasour-gif-4930781",
        "https://tenor.com/view/yee-dinosaur-meme-smile-gif-15696659",
        "https://tenor.com/view/yeet-yee-yeee-meme-gif-13537661",
    ];
    if (args[0] == "all") {
        yees.forEach(function (yee) { return message.channel.send(yee); });
    }
    else {
        var random = Math.floor(Math.random() * yees.length);
        message.channel.send(yees[random]);
    }
}
exports.execute = execute;
