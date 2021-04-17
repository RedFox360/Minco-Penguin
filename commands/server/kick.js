"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
exports.name = "kick";
exports.description = "[ADMIN ONLY] Kick members";
exports.usage = "!kick <@user>";
/** @param {Message} message */
function execute(message) {
    if (message.member.hasPermission("KICK_MEMBERS")) {
        var mention = message.mentions.users.first();
        if (!mention)
            return "Mention a valid user";
        var memberTarget = message.guild.members.cache.get(mention.id);
        if (memberTarget.hasPermission("MANAGE_SERVER") && memberTarget.hasPermission("KICK_MEMBERS"))
            return message.channel.send("This person cannot be kicked.");
        memberTarget.kick();
        return memberTarget.tag + " was kicked from the server.";
    }
}
exports.execute = execute;
