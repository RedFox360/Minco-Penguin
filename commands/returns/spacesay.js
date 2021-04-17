"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.cooldown = exports.description = exports.name = void 0;
exports.name = "spacesay";
exports.description = "puts spaces between characters in the say command";
exports.cooldown = 3;
exports.usage = "!spacesay <words>";
function execute(message, args, cmd, client, profileData) {
    var msgSplit = args.join(" ").split("");
    for (var i = 0; i < msgSplit.length; i++) {
        if (msgSplit[i] != "_" && msgSplit[i] != "*" && msgSplit[i] != "~") {
            if (msgSplit[i + 1] != "*" && msgSplit[i + 1] != "_" && msgSplit[i + 1] != "~")
                msgSplit[i] += " ";
        }
    }
    var msg = msgSplit.join("");
    message.channel.send(msg);
}
exports.execute = execute;
