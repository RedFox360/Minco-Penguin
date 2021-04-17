"use strict";
exports.__esModule = true;
exports.commands = void 0;
var Discord = require("discord.js");
var client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
var mongoose = require("mongoose");
exports.commands = new Discord.Collection();
var command_handler_ts_1 = require("./handlers/command_handler.ts");
var event_handler_ts_1 = require("./handlers/event_handler.ts");
command_handler_ts_1["default"](client);
event_handler_ts_1["default"](client);
mongoose
    .connect("mongodb+srv://RedFox360:RedwoodMongo@mincopenguin.dv0uv.mongodb.net/MincoPenguinDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(function () {
    console.log("Connected to the database!");
})["catch"](console.error);
var server_ts_1 = require("./server.ts");
server_ts_1["default"]();
client.login("NzI1OTE3OTE5MjkyMTYyMDUx.XvVtvg.cFpvLSkJrIyGfnRErIcVnbM_waY");
