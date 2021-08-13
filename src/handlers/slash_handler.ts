import { rest } from "../main";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { readdirSync } from "fs";

export default async (client: Client) => {
	const categories = readdirSync("./src/slashCommands/").filter(
		(file) => !file.includes(".")
	);
	const data = [];
	for (const category of categories) {
		const commands = readdirSync(`./src/slashCommands/${category}`).filter(
			(file) => file.endsWith(".ts")
		);
		for (const commandName of commands) {
			const command = await import(
				`../slashCommands/${category}/${commandName}`
			);
			(client as any).commands.set(command.data.name, command);
			console.log("added " + command.data.name);
			data.push(command.data);
		}
	}
	console.log(`commands added || command count: ${data.length + 1}`);
	await rest.put(Routes.applicationCommands(client.user.id), {
		body: data,
	});
};
