"use strict";
exports.__esModule = true;
exports.execute = exports.description = void 0;
var discord_js_1 = require("discord.js");
name: "code";
exports.description = "sends info about the code";
function execute(message) {
    var pingEmbed = new discord_js_1.MessageEmbed()
        .setTitle(":robot_face: Code Info")
        .setColor("70E5FF")
        .addFields({ name: "Node Version", value: process.version }, { name: "Discord.js Version", value: "v" + discord_js_1.version }, {
        name: "Heroku",
        value: "Heroku free account, view the server [here](https://minco-penguin.herokuapp.com/)"
    }, {
        name: "Packages used",
        value: "discord.js, ms, dotenv, express, fs, mongoose"
    });
    message.channel.send(pingEmbed);
}
exports.execute = execute;
