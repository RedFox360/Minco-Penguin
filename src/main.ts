import { Client, Intents, Collection } from "discord.js";
import { REST } from "@discordjs/rest";
import { connect } from "mongoose";
import { config as loadenv } from "dotenv";
import commandHandler from "./handlers/command_handler";
import eventHandler from "./handlers/event_handler";
import slashHandler from "./handlers/slash_handler";
loadenv();

connect(process.env.SRV, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})
	.then(() => {
		console.log("Connected to the database!");
	})
	.catch(console.error);

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	],
});
(client as any).commands = new Collection();

client.on("ready", async () => {
	commandHandler(client);
	eventHandler(client);
	slashHandler(client);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity("slash commands", { type: "LISTENING" });
});

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);
client.login(process.env.TOKEN);

export { rest };
