import viewLogs from '../../functions/view_logs';
import { SlashCommand } from '../../types';
import isNumeric from '../../functions/isNumeric';
import { GuildMember, User } from 'discord.js';
const logs = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('logs')
      .setDescription('Mod log related commands')
      .addSubcommand(subcommand =>
        subcommand
          .setName('member')
          .setDescription("View a user's mod logs")
          .addUserOption(option =>
            option
              .setName('user')
              .setDescription('The user whose logs to view')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('user_id')
          .setDescription("View a user's logs from their id")
          .addStringOption(option =>
            option
              .setName('id')
              .setDescription('The id of the user whose logs to view')
              .setRequired(true)
          )
      )
  )
  .setRun(async interaction => {
    let member: GuildMember, user: User;
    if (interaction.options.getSubcommand() === 'member') {
      member = interaction.options.getMember('user');
      user = member.user;
    } else {
      const id = interaction.options.getString('id');
      if (!isNumeric(id)) {
        await interaction.reply({
          content: 'That id is not a number',
          ephemeral: true
        });
        return;
      }
      try {
        user = await interaction.client.users.fetch(id);
      } catch {
        await interaction.reply({
          content:
            "You provided an invalid id or that user couldn't be found",
          ephemeral: true
        });
        return;
      }
    }
    await viewLogs(interaction, false, member, user);
  });

export default logs;
