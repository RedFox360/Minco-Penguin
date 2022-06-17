import { MessageEmbed, Permissions } from 'discord.js';
import { logKick } from '../../functions/log_functions';
import { SlashCommand } from '../../types';

const kick = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('kick')
      .setDescription('Kick a member from the server')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to kick')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('reason')
          .setDescription('Why did you kick this user?')
          .setRequired(false)
      )
      .addBooleanOption(option =>
        option
          .setName('silent')
          .setDescription(
            'Make the interaction response a private message'
          )
          .setRequired(false)
      )
  )
  .setPermissions(Permissions.FLAGS.KICK_MEMBERS)
  .setRun(async interaction => {
    const member = interaction.options.getMember('user');
    if (member.id === interaction.user.id) {
      await interaction.reply({
        content: "You can't kick yourself!",
        ephemeral: true
      });
      return;
    }
    if (member.user.bot) {
      await interaction.reply({
        content:
          "You can't kick a bot using Minco Penguin, please use the built in feature instead",
        ephemeral: true
      });
      return;
    }
    if (!member.kickable) {
      await interaction.reply({
        content:
          'The bot does not have the permissions to kick that user!',
        ephemeral: true
      });
      return;
    }
    if (
      interaction.member.roles.highest.comparePositionTo(
        member.roles.highest
      ) < 0
    ) {
      // interaction member has lower perms than member they are trying to timeout
      await interaction.reply({
        content: "You can't kick that user",
        ephemeral: true
      });
      return;
    }
    const reason = interaction.options.getString('reason');
    const silent = interaction.options.getBoolean('silent') ?? false;
    const formattedReason = reason
      ? `*${reason}*`
      : 'No reason provided';
    await member.kick(reason);
    const { currentCaseNo } = await logKick(
      member.id,
      interaction.guildId,
      reason,
      interaction.user.id
    );
    const kickEmbed = new MessageEmbed()
      .setColor('#CB4335')
      .setAuthor({
        name: member.user.tag,
        iconURL: member.user.displayAvatarURL({
          dynamic: true
        })
      })
      .setTitle('Kicked')
      .setDescription(
        `${member} has been kicked from the server
Case #${currentCaseNo}
Reason: ${formattedReason}`
      )
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL({ dynamic: true })
      });
    member
      .send(
        `#${currentCaseNo} | You were kicked from **${
          interaction.guild.name
        }** ${silent ? `by ${interaction.user}` : ''}
Reason: ${formattedReason}`
      )
      .catch(() => null);
    await interaction.reply({
      embeds: [kickEmbed],
      ephemeral: silent
    });
  });

export default kick;
