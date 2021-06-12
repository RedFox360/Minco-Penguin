const Discord = require("discord.js");
const client = new Discord.Client({
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const mongoose = require("mongoose");

client.commands = new Discord.Collection();
require("./handlers/command_handler")(client);
require("./handlers/event_handler")(client);

Array.prototype.rand = function () {
	var ri = Math.floor(Math.random() * this.length);
	var val = this[ri];

	return val;
};

mongoose
	.connect(process.env.SRV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(console.error);

client.login(process.env.TOKEN);
