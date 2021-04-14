const profileModel = require("../../models/profileSchema")
module.exports = {
    name: "withdraw",
    aliases: ["wd"],
    description: "Withdraw coins from your bank",
    cooldown: 5,
    usage: '!withdraw <number>',
    async execute(message, args, cmd, client, profileData) {
        const amount = parseInt(args[0]);
        if (isNaN(amount)) return message.channel.send("Enter a valid number");
        if (amount % 1 != 0 || amount <= 0) return message.channel.send('Withdraw amount must be a whole number');
        try {
            if (amount > profileData.bank) return message.channel.send("You don't have that amount of Minco Dollars in your bank.");
            await profileModel.findOneAndUpdate({ userID: message.author.id }, {
                $inc: {
                    mincoDollars: amount,
                    bank: -amount
                }
            })
        } catch (err) {
            console.log(err);
        }
        message.channel.send(`You withdrawed ${amount} Minco Dollars.`)
    }
}
