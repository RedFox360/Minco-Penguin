import setAutoWarn from '../../functions/autowarn/set_auto_warn';
import viewAutoWarn from '../../functions/autowarn/view_auto_warn';
import removeAutoWarn from '../../functions/autowarn/remove_auto_warn';
import autoModProfanity from '../../functions/for_commands/auto_mod_profanity';
import { SlashCommand } from '../../types';
import { PermissionFlagsBits } from 'discord.js';

const autoWarn = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('auto-mod')
			.setDescription('Set up automod for your server')
			.setDefaultMemberPermissions(
				PermissionFlagsBits.ModerateMembers |
					PermissionFlagsBits.ManageGuild
			)
			.addSubcommandGroup(group =>
				group
					.setName('warn')
					.setDescription(
						'Actions when a user reaches a certain amount of warns'
					)
					.addSubcommand(setAutoWarn.builder)
					.addSubcommand(viewAutoWarn.builder)
					.addSubcommand(removeAutoWarn.builder)
			)
			.addSubcommandGroup(group =>
				group
					.setName('punishment')
					.setDescription(
						'Actions when a user does something not allowed'
					)
					.addSubcommand(autoModProfanity.builder)
			)
	)
	.setRun(async interaction => {
		switch (interaction.options.getSubcommand()) {
			case 'set': {
				await setAutoWarn.run(interaction);
				return;
			}
			case 'view': {
				await viewAutoWarn.run(interaction);
				return;
			}
			case 'remove': {
				await removeAutoWarn.run(interaction);
				return;
			}
			case 'profanity': {
				await autoModProfanity.run(interaction);
				return;
			}
		}
	});
export default autoWarn;
