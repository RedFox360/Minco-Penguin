const { MessageEmbed } = require("discord.js");
module.exports = {
    name: 'slowmode',
    description: "[MANAGE CHANNELS] Changes slowmode",
    usage: '!slowmode <number>',
    execute(message, args) {
        if (message.member.hasPermission("MANAGE_CHANNELS")) {
            if (!args.length) return "You didn't provide any arguments.";
            var slowmode;
            if (args[0] == 'off') slowmode = 0;
            else slowmode = args[0];
            message.channel.setRateLimitPerUser(slowmode, null);
            let confirmEmbed = new MessageEmbed()
                .setColor('#7E78D2')
                .setTitle("Slowmode")
                .setDescription(`Slowmode set to ${slowmode} seconds`)
            message.channel.send(confirmEmbed)
        } else {
            return "You don't have permissions to change slowmode.";
        }
    }
}