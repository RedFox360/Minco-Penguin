import { rest } from "../main";
import { Routes } from "discord-api-types/v9";
import { Client } from "discord.js";
import { readdirSync } from "fs";

export default async (client: Client, updateCommands: boolean) => {
	const categories = readdirSync("./src/slashCommands/").filter(
		(file) => !file.includes(".")
	);
	const data = [];
	const dmusdOnlyData = [];
	for (const category of categories) {
		const commands = readdirSync(`./src/slashCommands/${category}`).filter(
			(file) => file.endsWith(".ts")
		);
		for (const commandName of commands) {
			const command = await import(
				`../slashCommands/${category}/${commandName}`
			);
			const commandData = command.data.toJSON();
			if (category === "dmusd_only") {
				dmusdOnlyData.push(commandData);
			} else {
				data.push(commandData);
			}
			(client as any).commands.set(commandData.name, command);
			console.log("added " + commandData.name);
		}
	}
	console.log(`commands added || command count: ${data.length + 1}`);
	if (updateCommands) {
		await rest.put(Routes.applicationCommands(client.user.id), {
			body: data,
		});
		await client.guilds.cache
			.get("785642761814671381")
			?.commands.set(dmusdOnlyData);
	}
};
