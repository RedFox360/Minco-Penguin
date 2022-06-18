/* eslint-disable camelcase */
import * as setAnnounceMessage from '../../functions/set/set_announce_message';
import * as setBirthday from '../../functions/set/set_birthday';
import * as setTimezone from '../../functions/set/set_timezone';
import * as setBoolean from '../../functions/set/set_bool';
import * as setWelcomeChannel from '../../functions/set/set_welcome_channel';
import * as setRole from '../../functions/set/set_role';
import * as setStarboard from '../../functions/set/set_starboard';
import * as setFavorite from '../../functions/set/set_favorites';
import { SlashCommand } from '../../types';

const commands = {
	announce_message: setAnnounceMessage.run,
	birthday: setBirthday.run,
	boolean: setBoolean.run,
	timezone: setTimezone.run,
	welcome_channel: setWelcomeChannel.run,
	starboard: setStarboard.run,
	role: setRole.run,
	favorite: setFavorite.run
};
const setData = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('set')
			.setDescription('Set values for your user/server')
			.addSubcommand(setAnnounceMessage.subcommand)
			.addSubcommand(setBirthday.subcommand)
			.addSubcommand(setBoolean.subcommand)
			.addSubcommand(setTimezone.subcommand)
			.addSubcommand(setWelcomeChannel.subcommand)
			.addSubcommand(setStarboard.subcommand)
			.addSubcommand(setRole.subcommand)
			.addSubcommand(setFavorite.subcommand)
	)
	.setRun(interaction =>
		commands[interaction.options.getSubcommand()](interaction)
	);

export default setData;
