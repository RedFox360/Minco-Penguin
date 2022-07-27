import {
	ActivityType,
	Client,
	Collection,
	Partials
} from 'discord.js';
import { REST } from '@discordjs/rest';
import ModelClient from 'mincomodels';
import { connect, connection } from 'mongoose';
import { GatewayIntentBits } from 'discord.js';
import { config as loadenv } from 'dotenv';
import eventHandler from './handlers/event_handler';
import slashHandler from './handlers/slash_handler';

const inDev = !process.argv.includes('--prod');
console.log(`inDev: ${inDev}`);
if (inDev) loadenv();

const client = new Client({
	intents:
		GatewayIntentBits.Guilds |
		GatewayIntentBits.GuildMessages |
		GatewayIntentBits.GuildMessageReactions |
		GatewayIntentBits.GuildMembers |
		GatewayIntentBits.GuildBans |
		GatewayIntentBits.GuildEmojisAndStickers |
		GatewayIntentBits.DirectMessages |
		GatewayIntentBits.GuildVoiceStates |
		GatewayIntentBits.GuildWebhooks |
		GatewayIntentBits.MessageContent,
	partials: [Partials.Channel, Partials.Message, Partials.Reaction]
});
(client as any).commands = new Collection();

connect(process.env.SRV)
	.then(() => {
		console.log('Connected to the database!');
	})
	.catch(console.error);

const readyEventName = '⏰ Ready Event';
client.on('ready', async () => {
	console.time(readyEventName);
	await eventHandler(client);
	await slashHandler(client, inDev);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity(`${client.guilds.cache.size} servers`, {
		type: ActivityType.Watching
	});
	console.timeEnd(readyEventName);
});

const token = inDev ? process.env.CANARY_TOKEN : process.env.TOKEN;
const rest = new REST({ version: '9' }).setToken(token);
const modelClient = new ModelClient(connection);

client.login(token);

export { rest, modelClient };
