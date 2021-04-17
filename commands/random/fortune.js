"use strict";
exports.__esModule = true;
exports.execute = exports.cooldown = exports.description = exports.name = void 0;
exports.name = "fortune";
exports.description = "Gives you a fortune";
exports.cooldown = 4;
function execute() {
    var fortunes = [
        "For the next coming bot war, you should be on the side of Minco Penguin",
        "Thanos will come alive again and *snap*",
        "Tomorrow you will wake up with a cockroach under your pillow",
        "Your internet will break down tomorrow",
        "There will be **no** tomorrow",
        "You will grow a mustache tomorrow (if you are a boy)",
    ];
    var random = Math.floor(Math.random() * fortunes.length);
    return fortunes[random];
}
exports.execute = execute;
