import { rest } from '../main';
import { Routes } from 'discord.js';
import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { SlashCommand, UserContextMenu } from '../types';

export default async (
	client: Client,
	inDev = false,
	updateCommands = false
) => {
	const mincoPenguinServer = client.guilds.cache.get(
		'848987165601693737'
	);
	const categories = readdirSync('./src/slash_commands/').filter(
		file => !file.includes('.') // folders only
	);
	const commandPromises: Array<
		Promise<{ default: SlashCommand | UserContextMenu }>
	> = [];
	const data = [];
	categories.forEach(category =>
		readdirSync(`./src/slash_commands/${category}`)
			.filter(file => file.endsWith('.ts'))
			.forEach(commandName => {
				commandPromises.push(
					import(`../slash_commands/${category}/${commandName}`)
				);
			})
	);
	(await Promise.all(commandPromises)).forEach(
		({ default: command }) => {
			const commandData = command.builder.toJSON();
			client['commands'].set(commandData.name, command);
			if (updateCommands)
				console.log(
					`${commandData.name} | dmp: ${commandData.default_member_permissions}`
				);
			data.push(commandData);
		}
	);
	if (!updateCommands) {
		const commands = await (inDev
			? mincoPenguinServer.commands.fetch()
			: client.application.commands.fetch());
		commands.forEach(command => {
			console.log(`${command.name} | ${command.id}`);
		});
	} else {
		console.log(`commands set || command count: ${data.length}`);
		if (inDev) {
			await rest.put(
				Routes.applicationGuildCommands(
					client.user.id,
					mincoPenguinServer.id
				),
				{
					body: data
				}
			);
		} else {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: data
			});
		}
	}
};
