module.exports = {
    name: 'clear',
    description: '[MANAGE MESSAGES] Clears [number] messages from a text channel',
    usage: '!clear <number>',
    async execute(message, args) {
        if (message.author.id == '769313131108237322') return message.channel.send("You don't have the correct permissions to execute this command.");
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            if (!args[0]) return message.channel.send("Please enter the amount of messages that you want to clear");
            if (isNaN(args[0])) return message.channel.send("Please enter a valid number");
            if (args[0] > 100) return message.channel.send("You cannot delete more than 100 messages!");
            if (args[0] < 1) return message.channel.send("You must delete at least one message");
            await message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                message.channel.bulkDelete(messages);
            })
        } else {
            message.channel.send("You don't have the correct permissions to execute this command.");
        }
    }
}