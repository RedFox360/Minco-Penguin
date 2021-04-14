module.exports = {
    name: 'random',
    description: 'Returns a random number between 2 numbers',
    aliases: ['rand'],
    usage: '!random <min number> <max number>',
    execute(message, args) {
        let min = parseInt(args[0]);
        let max = parseInt(args[1]);
        if (isNaN(min) || isNaN(max)) return message.channel.send("Enter valid numbers");
        if (max < min) return message.channel.send("Your second number must be greater than your first number");
        if (max > 1000000) return message.channel.send("Your maximum may not be greater than 1,000,000")
        let random = Math.floor(Math.random() * (max - min + 1)) + min;
        return random.toLocaleString();
    }
}
