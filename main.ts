import * as Discord from "discord.js";

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });
import * as mongoose from "mongoose";

client.commands = new Discord.Collection();

import command_handler from "./handlers/command_handler";
import event_handler from "./handlers/event_handler";
command_handler(client);
event_handler(client);

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
