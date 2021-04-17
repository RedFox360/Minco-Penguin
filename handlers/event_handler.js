"use strict";
exports.__esModule = true;
var fs = require("fs");
exports["default"] = (function (client) {
    var eventFiles = fs.readdirSync("./events").filter(function (file) { return file.endsWith(".js"); });
    var _loop_1 = function (file) {
        Promise.resolve().then(function () { return require("../events/" + file); }).then(function (event) {
            var eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        });
    };
    for (var _i = 0, eventFiles_1 = eventFiles; _i < eventFiles_1.length; _i++) {
        var file = eventFiles_1[_i];
        _loop_1(file);
    }
});
