const Discord = require('discord.js')
require("dotenv").config();
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
const mongoose = require('mongoose')
client.commands = new Discord.Collection();
client.events = new Discord.Collection();

require(`./handlers/command_handler`)(client);
require(`./handlers/event_handler`)(client);

mongoose.connect(process.env.SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to the database!');
}).catch(console.error);

require('./server')();

client.login(process.env.TOKEN);