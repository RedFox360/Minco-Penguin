import * as fs from "fs";
import { Client } from "discord.js";
export default async (client: Client) => {
	const eventFiles = fs
		.readdirSync(`./src/events`)
		.filter((file) => file.endsWith(".ts"));
	for (const file of eventFiles) {
		const { default: event } = await import(`../events/${file}`);
		const eventName = file.split(".")[0];
		client.on(eventName, (...args) => event(...args, client));
	}
};
