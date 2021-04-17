"use strict";
// the chat has died
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
exports.name = "tchd";
exports.description = "Sends a random the chat has died message";
function execute() {
    var randomMessage = [
        "The chat has died :(",
        "What happened to the chat?",
        "WHAT??",
        "Silence...",
        "Quiet...",
        "Dead chat",
        "The chat is sad",
        "You're so mean, you killed the chat",
        "That's not very nice of you to kill the chat",
        "**DEAD SILENCE**",
        ":cricket:",
        "Why why why?",
        "Chat = :(",
    ];
    var random = Math.floor(Math.random() * randomMessage.length);
    return randomMessage[random];
}
exports.execute = execute;
