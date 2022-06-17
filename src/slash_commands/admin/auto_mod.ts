import * as setAutoWarn from '../../functions/autowarn/set_auto_warn';
import * as viewAutoWarn from '../../functions/autowarn/view_auto_warn';
import * as removeAutoWarn from '../../functions/autowarn/remove_auto_warn';
import * as autoModProfanity from '../../functions/auto_mod_profanity';
import { SlashCommand } from '../../types';
import { Permissions } from 'discord.js';

const autoWarn = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('auto_mod')
      .setDescription('Set up automod for your server')
      .addSubcommandGroup(group =>
        group
          .setName('warn')
          .setDescription(
            'Actions when a user reaches a certain amount of warns'
          )
          .addSubcommand(setAutoWarn.subcommand)
          .addSubcommand(viewAutoWarn.subcommand)
          .addSubcommand(removeAutoWarn.subcommand)
      )
      .addSubcommandGroup(group =>
        group
          .setName('punishment')
          .setDescription(
            'Actions when a user does something not allowed'
          )
          .addSubcommand(autoModProfanity.subcommand)
      )
  )
  .setPermissions(
    Permissions.FLAGS.MODERATE_MEMBERS,
    Permissions.FLAGS.MANAGE_GUILD
  )
  .setPermissionsRequiredForBot(false)
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
