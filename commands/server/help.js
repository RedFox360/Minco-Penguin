const Discord = require('discord.js')

const fs = require("fs");
module.exports = {
    name: 'help',
    description: 'Help for all Minco Penguin commands!',
    aliases: ['c'],
    /**
     * @param {Discord.Message} message
     * @param {Discord.Client} client
     */
    async execute(message, args, _, client) {
        if (args.length) {
            const command = client.commands.get(args[0]);
            if (!command) return message.channel.send("Enter a valid command name");
            message.channel.send(command.usage || command.name);
            message.channel.send('`' + command.description + '`');
            return;
        }
        var description = 'Use the :rewind: and :fast_forward: reactions to switch between pages.\nDon\'t put **< >** in the actual commands.\n**( )** show optional arguments\n\n**Categories**:\n`INFO/USEFUL commands`\n`FUN Commands`\n`SERVER Commands`\n`RANDOM RETURN Commands`\n`ECONOMY Commands`';
        var color = 'C782FE'; // light purple

        var titles = ['Minco Penguin Commands', 'INFO/USEFUL Commands', 'FUN Commands', 'SERVER Commands', 'RANDOM RETURN Commands', 'ECONOMY Commands']
        var currentPage = 0;
        let helpEmbed = new Discord.MessageEmbed()
            .setTitle(titles[currentPage])
            .setDescription(description)
            .setColor(color)
            .setFooter(message.guild.name);


        const helpMsg = await message.channel.send(helpEmbed)
        const fields = [0, [], [], [], [], []];

        const categories = fs.readdirSync('./commands/').filter(file => !file.endsWith('.DS_Store'));
        for (const category of categories) {
            if (category != 'hidden') {
                const commandFiles = fs.readdirSync(`./commands/${category}`).filter(File => File.endsWith('.js'));
                for (const file of commandFiles) {
                    const command = require(`../../commands/${category}/${file}`)
                    let pos = 0;
                    if (category == 'returns') pos = 1;
                    else if (category == 'fun') pos = 2;
                    else if (category == 'server') pos = 3;
                    else if (category == 'random') pos = 4;
                    else if (category == 'economy') pos = 5;
                    if (command.usage) fields[pos].push([command.usage, command.description]);
                    else fields[pos].push([`!${command.name}`, command.description]);
                }
            }
        }
        try {
            await helpMsg.react('⏪');
            await helpMsg.react('⏩');
        } catch (err) {
            console.error(err);
        }

        const filter = (reaction, user) => user.id === message.author.id;
        const collector = helpMsg.createReactionCollector(filter, { time: 300000 });
        await collector.on('collect', async (reaction, user) => {
            if (reaction.emoji.name == "⏪") {
                if (currentPage != 0) currentPage--;
                if (currentPage == 0) {
                    helpEmbed = new Discord.MessageEmbed()
                        .setTitle(titles[0])
                        .setDescription(description)
                        .setColor(color)
                        .setFooter(message.guild.name);
                    helpMsg.edit(helpEmbed)
                }
                else {
                    helpEmbed = new Discord.MessageEmbed()
                        .setTitle(titles[currentPage])
                        .setColor(color)
                        .setFooter(message.guild.name);

                    fields[currentPage].forEach(field => {
                        helpEmbed.addField(field[0], field[1]);
                    });
                    helpMsg.edit(helpEmbed);
                }
            }
            else if (reaction.emoji.name == "⏩") {
                if (currentPage != 5) currentPage++;
                helpEmbed = new Discord.MessageEmbed()
                    .setTitle(titles[currentPage])
                    .setColor(color)
                    .setFooter(message.guild.name);
                fields[currentPage].forEach(field => {
                    helpEmbed.addField(field[0], field[1]);
                });
                helpMsg.edit(helpEmbed);
            }

            const userReactions = helpMsg.reactions.cache.filter(react => react.users.cache.has(message.author.id));
            try {
                for (const reaction of userReactions.values()) {
                    await reaction.users.remove(message.author.id);
                }
            } catch (error) {
                console.error('Failed to remove reactions.');
            }
        })
    }
}