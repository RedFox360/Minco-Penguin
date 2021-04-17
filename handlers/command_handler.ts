import { commands } from "../main.ts";
import { Client } from "discord.js";
import * as fs from "fs";
export default (client: Client) => {
	const categories = fs.readdirSync("./commands/").filter((file) => !file.endsWith(".DS_Store"));
	for (const category of categories) {
		const commandFiles = fs.readdirSync(`./commands/${category}`).filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			import(`../commands/${category}/${file}.ts`).then((command) => {
				commands.set(file.split(".")[0], command);
			});
		}
	}
};
