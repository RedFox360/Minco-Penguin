"use strict";
exports.__esModule = true;
var main_1 = require("../main");
var fs = require("fs");
exports["default"] = (function (client) {
    var categories = fs.readdirSync("./commands/").filter(function (file) { return !file.endsWith(".DS_Store"); });
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var category = categories_1[_i];
        var commandFiles = fs.readdirSync("./commands/" + category).filter(function (file) { return file.endsWith(".js"); });
        var _loop_1 = function (file) {
            Promise.resolve().then(function () { return require("../commands/" + category + "/" + file); }).then(function (command) {
                main_1.commands.set(file.split(".")[0], command);
            });
        };
        for (var _a = 0, commandFiles_1 = commandFiles; _a < commandFiles_1.length; _a++) {
            var file = commandFiles_1[_a];
            _loop_1(file);
        }
    }
});
