import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { minutesToMilliseconds } from 'date-fns';
import { CommandInteraction } from 'discord.js';
import ms from 'ms';
import prettyMs from 'pretty-ms';
import { updateServer } from './models';
import { maxTime, minTime } from './timeout_times';

export const subcommand = new SlashCommandSubcommandBuilder()
  .setName('profanity')
  .setDescription(
    'Set a punishment when a user sends something profane'
  )
  .addStringOption(option =>
    option
      .setName('punishment_type')
      .setDescription(
        'The type of the punishment you want to use (temp ban not supported)'
      )
      .addChoice('Warn', 'warn:warned')
      .addChoice('Timeout', 'timeout')
      .addChoice('Kick', 'kick:kicked')
      .addChoice('Ban', 'ban:banned')
      .addChoice('Remove Punishment', 'rp')
      .setRequired(true)
  )
  .addStringOption(option =>
    option
      .setName('timeout_time')
      .setDescription(
        'The amount of time to timeout the user (if you chose timeout punishment)'
      )
      .setRequired(false)
  );

export async function run(interaction: CommandInteraction<'cached'>) {
  const [punishmentType, verb] = interaction.options
    .getString('punishment_type')
    .split(':');
  if (punishmentType === 'rp') {
    await updateServer(
      {
        profanityPunishment: undefined
      },
      interaction.guildId
    );
    await interaction.reply('Profanity punishments removed');
  } else if (punishmentType === 'timeout') {
    const timeoutTime = interaction.options.getString('timeout_time');
    if (!timeoutTime) {
      await interaction.reply({
        content:
          'You need to provide a time if you chose the timeout punishment',
        ephemeral: true
      });
      return;
    }
    const msTime = ms(timeoutTime);
    const time =
      msTime ?? minutesToMilliseconds(parseInt(timeoutTime));
    if (isNaN(time)) {
      await interaction.reply({
        content: 'That time is invalid',
        ephemeral: true
      });
      return;
    }
    if (time < minTime || time > maxTime) {
      await interaction.reply({
        content: 'Your time must be between 10 seconds and 28 days',
        ephemeral: true
      });
      return;
    }
    await updateServer(
      {
        profanityPunishment: { punishment: 'warn', time }
      },
      interaction.guildId
    );

    await interaction.reply(
      `Warn punishments updated: users will be timeouted for ${prettyMs(
        time,
        { verbose: true }
      )} when they send a profane message`
    );
    return;
  } else {
    await updateServer(
      {
        profanityPunishment: { punishment: punishmentType }
      },
      interaction.guildId
    );
    await interaction.reply(
      `Profanity punishments updated: users will be ${verb} when they send a profane message (note: the punishments don't apply to mods)`
    );
  }
}
