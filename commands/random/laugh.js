"use strict";
exports.__esModule = true;
exports.execute = exports.aliases = exports.description = exports.name = void 0;
exports.name = "laugh";
exports.description = "Fun command: sends a random laugh";
exports.aliases = ["haha", "hehe"];
function execute() {
    var laughs = ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"];
    var random = Math.floor(Math.random() * laughs.length);
    return laughs[random];
}
exports.execute = execute;
