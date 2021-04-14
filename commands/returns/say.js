module.exports = {
    name: 'say',
    description: "This is a say command for Minco Penguin",
    cooldown: 3,
    usage: '!say <words>',
    execute(message, args, _, client) {
        if (!args.length) return "You didn't provide any arguments.";

        if (args[0].startsWith('<#')) {
            var channel = args[0]
            channel = channel.replace('<', '').replace('>', '').replace('#', '')
            let msg = "";
            for (let i = 1; i < args.length; i++) {
                msg += args[i] + " ";
            }
            const chnl = client.channels.cache.get(channel);
            chnl.send(msg);
            message.react('✅');
        }
        else {
            message.channel.send(args.join(' '))
        }
    }
}