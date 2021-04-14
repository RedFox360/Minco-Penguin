import { Message } from 'discord.js';
const profileModel = require('../../models/profileSchema');
module.exports = {
    name: 'beg',
    cooldown: 240, //4 minutes
    aliases: ['gimmemoney'],
    usage: '!beg',
    description: 'Beg for Minco Dollars',
    /** @param {Message} message */
    async execute(message, args, cmd, client, profileData) {
        let money = cmd === 'gimmemoney' ? 2 : 4;
        let numberEcon = Math.floor(Math.random() * money) + 1;
        await profileModel.findOneAndUpdate({ userID: message.author.id }, {
            $inc:
                { mincoDollars: numberEcon }
        });
        message.channel.send(`You received ${numberEcon} Minco Dollars!`);
    }
}