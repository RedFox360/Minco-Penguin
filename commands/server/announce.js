"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
var discord_js_1 = require("discord.js");
exports.name = "announce";
exports.description = "[ADMIN ONLY] Sends a message in the announcement channel";
exports.usage = "!announce <message>";
function execute(message, args) {
    if (message.member.hasPermission("ADMINISTRATOR") ||
        message.member.roles.cache.find(function (r) { return r.name === "Moderator"; }) ||
        message.author.id == "724786310711214118") {
        var announcementEmbed = new discord_js_1.MessageEmbed().setTitle("Announcement").setDescription(args.join(" ")).setColor("32E6C5");
        message.guild.systemChannel.send(announcementEmbed);
    }
    else {
        message.reply("This command can only be used by Admins");
    }
}
exports.execute = execute;
