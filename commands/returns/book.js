"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
exports.name = "book";
exports.description = "View a randomly selected book by my friend Ishan";
exports.usage = "!book <title/(random)>";
function execute(message, args, cmd, client, profileData) {
    if (message.guild.id == "725560003569778689" || message.guild.id == "818509629842522112") {
        var random = Math.floor(Math.random() * 5);
        if (args[0] == "Leo") {
            message.channel.send("View the Adventures of Leo the Owl here: ");
            message.channel.send("https://docs.google.com/document/d/1K8HNTuVe_0XQcKAYhCqXaPqjX3K8V0G0EetFwxb-1gI/edit?usp=sharing");
        }
        if ((random == 0 && args[0] == "random") || args[0] == "Valentine's") {
            message.channel.send("View the Valentine's Day Gem here: ");
            message.channel.send("https://docs.google.com/document/d/1has6vMejPv1HsErhuloGyfyZXTXbxA0ZJF5_XJd28eA/edit?usp=sharing");
        }
        if ((random == 1 && args[0] == "random") || args[0] == "Easter") {
            message.channel.send("View the Easter Island Adventure here: ");
            message.channel.send("https://docs.google.com/document/d/1QB5ydHT3lmgfGuoxJ_7eDRoCdT7cidH3iyD1W3HB9IU/edit?usp=sharing");
        }
        if ((random == 2 && args[0] == "random") || (args[0] == "St." && args[1] == "Patrick's")) {
            message.channel.send("View the St. Patrick's Day Robbery here: ");
            message.channel.send("https://docs.google.com/document/d/1ApT2ED6ahxH5yV61dcyHbP95Ax20drmCD57ZYuGTWUY/edit?usp=sharing");
        }
        if ((random == 3 && args[0] == "random") || args[0] == "Christmas") {
            message.channel.send("View the Christmas Adventure here: ");
            message.channel.send("https://docs.google.com/document/d/1zdyb2Fgq1TfPJ4QVKuhzyFUfYDUNYpqCilkYV5tBHZQ/edit?usp=sharing");
        }
        if ((random == 4 && args[0] == "random") || args[0] == "Halloween") {
            message.channel.send("View the Halloween Adventure here: ");
            message.channel.send("https://docs.google.com/document/d/14xMJUSB3uhUgwa-_-fwKxDklXhhSoxZ8D0tiXamZNjY/edit");
        }
    }
}
exports.execute = execute;
