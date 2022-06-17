import { rest } from '../main';
import {
  RESTPostAPIApplicationCommandsJSONBody,
  Routes
} from 'discord-api-types/v9';
import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import { readdirSync } from 'fs';
import { SlashCommand, UserContextMenu } from '../types';
// TODO: make dev only folder dev only
export default async (
  client: Client,
  inDev = false,
  updateCommands = false
) => {
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
      data.push(commandData);
    }
  );
  console.log(`commands set || command count: ${data.length}`);

  if (inDev) {
    const mincoPenguinServer = client.guilds.cache.get(
      '848987165601693737'
    );
    const commands = await (updateCommands
      ? mincoPenguinServer?.commands.set(data)
      : mincoPenguinServer.commands.fetch());
    commands.forEach(command =>
      console.log(`${command.name} | ${command.id}`)
    );
  } else if (updateCommands) {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: data
    });
  }
};
