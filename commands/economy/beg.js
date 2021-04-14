const { Message } = require('discord.js');
const profileModel = require('../../models/profileSchema');
module.exports = {
    name: 'beg',
    cooldown: 240, //4 minutes
    aliases: ['gimmemoney'],
    usage: '!beg',
    description: 'Beg for Minco Dollars',
    async execute(message, _, cmd) {
        let money = cmd === 'gimmemoney' ? 2 : 4;
        let numberEcon = Math.floor(Math.random() * money) + 1;
        await profileModel.findOneAndUpdate({ userID: message.author.id }, {
            $inc:
                { mincoDollars: numberEcon }
        });
        return `You received ${numberEcon} Minco Dollars!`;
    }
}