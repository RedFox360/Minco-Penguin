"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
exports.name = "bye";
exports.description = "Sends a random goodbye message";
function execute() {
    var byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
    var random = Math.floor(Math.random() * byes.length);
    return byes[random];
}
exports.execute = execute;
