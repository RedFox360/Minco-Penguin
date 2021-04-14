const profileModel = require('../../models/profileSchema')

module.exports = {
    name: 'setfav',
    description: 'Set your favorite animal, color, and food',
    usage: '!setfav <color/animal/food> <fav object>',
    async execute(message, args, _0, _1, profileData) {
        if (!args.length) {
            return message.channel.send("Valid usage: !setfav <animal/color/food> <favorite object>")
        }
        let favObj = "";
        for (let i = 1; i < args.length; i++) {
            favObj += args[i] + " ";
        }
        if (args[0] == 'animal') {
            await profileModel.findOneAndUpdate({ userID: message.author.id }, {
                favs: {
                    food: profileData.favs.food,
                    color: profileData.favs.color,
                    animal: favObj
                }
            })
        }
        else if (args[0] == 'color') {
            await profileModel.findOneAndUpdate({ userID: message.author.id }, {
                favs: {
                    food: profileData.favs.food,
                    color: favObj,
                    animal: profileData.favs.animal
                }
            })
        }
        else if (args[0] == 'food') {
            await profileModel.findOneAndUpdate({ userID: message.author.id }, {
                favs: {
                    food: favObj,
                    color: profileData.favs.color,
                    animal: profileData.favs.animal
                }
            })
        }
        else {
            return message.channel.send("Valid usage: !setfav <animal/color/food> <favorite object>")
        }
        message.channel.send(`Favorite ${args[0]} set to ${favObj}`);
    }
}