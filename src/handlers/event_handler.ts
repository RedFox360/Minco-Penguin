import { readdirSync } from 'fs';
import { Client } from 'discord.js';
export default async (client: Client) => {
	const eventFiles = readdirSync(`./src/events`).filter(
		file => file.endsWith('.ts') || file.endsWith('.js')
	);
	const eventPromises = [];
	const eventNames = [];
	for (const file of eventFiles) {
		eventPromises.push(import(`../events/${file}`));
		eventNames.push(file.split('.')[0]);
	}
	(await Promise.all(eventPromises)).forEach(
		({ default: event }, index) => {
			const eventName = eventNames[index];
			client.on(eventName, (...args) => event(...args, client));
			console.log(`Loaded event ${eventName}`);
		}
	);
};
