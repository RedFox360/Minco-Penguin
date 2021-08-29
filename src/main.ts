import { Client, Intents, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { connect } from "mongoose";
import scheduler from "./scheduler";
import eventHandler from "./handlers/event_handler";
import slashHandler from "./handlers/slash_handler";
import serverModel from "./models/serverSchema";

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.DIRECT_MESSAGES,
	],
});
(client as any).commands = new Collection();

client.on("ready", async () => {
	await connect(process.env.SRV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
		.then(() => {
			console.log("Connected to the database!");
		})
		.catch(console.error);

	await eventHandler(client);
	await slashHandler(client);
	scheduler(client);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity("slash commands", { type: "LISTENING" });
});

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
client.login(process.env.TOKEN);

export { rest };
