"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.description = exports.name = void 0;
exports.name = "ban";
exports.description = "[ADMIN ONLY] Ban members";
exports.usage = "!ban <@user>";
/** @param {Message} message */
function execute(message) {
    if (message.member.hasPermission("BAN_MEMBERS")) {
        var mention = message.mentions.users.first();
        if (!mention)
            return "Mention a valid user";
        var memberTarget = message.guild.members.cache.get(mention.id);
        if (memberTarget.hasPermission("MANAGE_SERVER") && memberTarget.hasPermission("BAN_MEMBERS"))
            return message.channel.send("This person cannot be banned.");
        memberTarget.ban();
        return memberTarget.tag + " was banned from the server.";
    }
}
exports.execute = execute;
