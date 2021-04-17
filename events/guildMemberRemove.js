import * as Discord from "discord.js";
export default (function (_, member) {
    var memberCount = member.guild.memberCount;
    var leaveEmbed = new Discord.MessageEmbed()
        .setColor("EC7063") // red
        .setTitle("Goodbye")
        .setDescription("It seems " + member.user.tag + " has left us. We now have " + memberCount + " members.");
    member.guild.systemChannel.send(leaveEmbed);
});
