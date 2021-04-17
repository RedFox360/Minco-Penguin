"use strict";
exports.__esModule = true;
var express_1 = require("express");
var app = express_1["default"]();
app.get("/", function (req, res) {
    res.send("Minco Penguin Host Server");
});
function run() {
    var port = process.env.PORT || 5000;
    app.listen(port);
}
exports["default"] = run;
