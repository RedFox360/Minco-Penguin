import { rest } from '../main';
import { Routes } from 'discord-api-types/v9';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';

export default async (client: Client, updateCommands: boolean) => {
	const categories = readdirSync('./src/slash_commands/').filter(
		file => !file.includes('.') // folders only
	);
	const commandPromises = [];
	const data = [];
	categories.forEach(category =>
		readdirSync(`./src/slash_commands/${category}`)
			.filter(file => file.endsWith('.ts'))
			.forEach(commandName => {
				commandPromises.push(
					import(
						`../slash_commands/${category}/${commandName}`
					)
				);
			})
	);
	(await Promise.all(commandPromises)).forEach(
		({ default: command }) => {
			const commandData = command.builder.toJSON();
			client['commands'].set(commandData.name, command);
			data.push(commandData);
		}
	);
	console.log(`commands set || command count: ${data.length}`);
	if (updateCommands) {
		await rest.put(Routes.applicationCommands(client.user.id), {
			body: data
		});
	}
};
