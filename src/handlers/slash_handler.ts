import { rest } from "../main";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { readdirSync } from "fs";

export default async (client: Client, useRest: boolean) => {
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
			const commandData = command.data.toJSON();
			(client as any).commands.set(commandData.name, command);
			console.log("added " + commandData.name);
			if (useRest) data.push(commandData);
		}
	}
	console.log(`commands added || command count: ${data.length + 1}`);
	if (useRest)
		await rest.put(Routes.applicationCommands(client.user.id), {
			body: data,
		});
};
