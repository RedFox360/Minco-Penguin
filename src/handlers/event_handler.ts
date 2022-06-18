import { readdirSync } from 'fs';
import { Client } from 'discord.js';
export default async (client: Client) => {
	const eventFiles = readdirSync(`./src/events`).filter(
		file => file.endsWith('.ts') || file.endsWith('.js')
	);
	const eventPromises: Array<Promise<{ default: any }>> = [];
	const eventNames: Array<string> = [];
	for (const file of eventFiles) {
		eventPromises.push(import(`../events/${file}`));
		eventNames.push(file.split('.')[0]);
	}
	const events = await Promise.all(eventPromises);
	events.forEach(exports => exports.default(client));
};
