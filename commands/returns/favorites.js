const profileModel = require('../../models/profileSchema')

const { Message } = require("discord.js");
module.exports = {
    name: 'favorites',
    description: 'Check the favorites of a user',
    usage: '!favorites <@user>',
    async execute(message) {
        const mention = message.mentions.users.first();
        if (!mention) return message.channel.send("Mention a valid user");
        let profile = await profileModel.findOne({ userID: mention.id })
        try {
            message.channel.send('Animal: ' + profile.favs.animal);
            message.channel.send('Color: ' + profile.favs.color);
            message.channel.send('Food: ' + profile.favs.food);
        } catch (err) {
            console.error(err);
        }
    }
}