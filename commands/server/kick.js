export var name = "kick";
export var description = "[ADMIN ONLY] Kick members";
export var usage = "!kick <@user>";
/** @param {Message} message */
export function execute(message) {
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
