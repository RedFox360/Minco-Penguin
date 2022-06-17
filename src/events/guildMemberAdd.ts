import Discord from 'discord.js';
import profileModel from '../models/profileSchema';
import ordinal from 'ordinal';
import { getProfile, updateServer } from '../functions/models';

export default (client: Discord.Client) =>
  client.on('guildMemberAdd', async (member: Discord.GuildMember) => {
    const profileData = await getProfile(member.id);
    const serverData = await updateServer(
      { $inc: { memberCount: member.user.bot ? 0 : 1 } },
      member.guild.id
    );
    if (member.user.bot) {
      if (serverData.botRole) member.roles.add(serverData.botRole);
      return;
    }
    if (serverData.joinRole) member.roles.add(serverData.joinRole);
    if (serverData.silenceJoins) return;
    if (!profileData) {
      await profileModel.create({
        userID: member.id,
        mincoDollars: 100,
        bank: 0,
        orbs: 0
      });
    }
    const { welcomeMessage, welcomeDM, memberCount } = serverData;
    const memberCountOrdinal = ordinal(memberCount);

    const joinEmbed = new Discord.MessageEmbed()
      .setColor('#58D68D') // green
      .setTitle('Welcome')
      .setDescription(
        welcomeMessage
          .replace(/\{server\}/g, member.guild.name)
          .replace(/\{mention\}/g, `<@${member.id}>`)
          .replace(/\{ord_member_count\}/g, memberCountOrdinal)
          .replace(/\{member_count\}/g, memberCount.toLocaleString())
          .replace(/\{user\}/g, member.user.username)
          .replace(/\{user_tag\}/g, member.user.tag)
      )
      .setThumbnail(member.user.avatarURL({ dynamic: true }));
    const channel = serverData.welcomeChannel
      ? member.client.channels.cache.get(serverData.welcomeChannel)
      : member.guild.systemChannel;
    if (!channel) return;
    (channel as Discord.TextChannel).send({
      embeds: [joinEmbed]
    });
    if (welcomeDM)
      try {
        await member.send(
          welcomeDM
            .replace(/\{server\}/g, member.guild.name)
            .replace(/\{mention\}/g, `<@${member.id}>`)
            .replace(/\{ord_member_count\}/g, memberCountOrdinal)
            .replace(
              /\{member_count\}/g,
              memberCount.toLocaleString()
            )
            .replace(/\{user\}/g, member.user.username)
            .replace(/\{user_tag\}/g, member.user.tag)
        );
      } catch (err) {
        // dm was not sent
      }
  });
