import { Client, Intents, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { connect } from 'mongoose';
import eventHandler from './handlers/event_handler';
import slashHandler from './handlers/slash_handler';

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.DIRECT_MESSAGES
	],
	partials: ['CHANNEL', 'MESSAGE', 'REACTION']
});
(client as any).commands = new Collection();

client.on('ready', async () => {
	await connect(process.env.SRV, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
		.then(() => {
			console.log('Connected to the database!');
		})
		.catch(console.error);

	await eventHandler(client);
	await slashHandler(client, false);
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity(`${client.guilds.cache.size} servers`, {
		type: 'WATCHING'
	});
});

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
client.login(process.env.TOKEN);

export { rest };
