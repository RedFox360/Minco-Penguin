import { rest } from "../main";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { readdirSync } from "fs";
import { cyan, yellow, red } from "chalk";

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
			const commandData = command.data.toJSON();
			(client as any).commands.set(commandData.name, command);
			console.log("added " + cyan(commandData.name));
			data.push(commandData);
		}
	}
	console.log(
		`${yellow("commands added")} || command count: ${red(data.length + 1)}`
	);
	await rest.put(Routes.applicationCommands(client.user.id), {
		body: data,
	});
};
