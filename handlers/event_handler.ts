import * as fs from "fs";
import { Client } from "discord.js";

export default (client: Client) => {
	const eventFiles = fs.readdirSync(`./events`).filter((file) => file.endsWith(".js"));
	for (const file of eventFiles) {
		import(`../events/${file}`).then((event) => {
			const eventName = file.split(".")[0];
			client.on(eventName, event.bind(null, client));
		});
	}
};
