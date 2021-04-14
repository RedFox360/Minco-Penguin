const { MessageEmbed, Message } = require("discord.js");
module.exports = {
    name: 'poll',
    description: 'Sends a poll in the channel with thumbsup and thumbsdown emojis\nUse spoll to add a shrug emoji',
    aliases: ['spoll'],
    usage: '!poll/spoll <Question>',
    execute(message, args, cmd) {
        var react = ['👍', '👎'];
        if (cmd === 'spoll') react.push('🤷');
        var msgArgs = args.join(' ');
        let pollEmbed = new MessageEmbed()
            .setColor('BLUE')
            .setAuthor(message.member.displayName)
            .setTitle("Poll")
            .setDescription(msgArgs)
            .setThumbnail(message.author.avatarURL());
        message.delete();
        message.channel.send(pollEmbed).then(msg => {
            react.forEach(emoji => msg.react(emoji));
        });
    }
}