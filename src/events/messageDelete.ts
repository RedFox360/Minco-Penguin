import { Client, Message, MessageEmbed } from 'discord.js';
import { getServer } from '../functions/models';

export default (client: Client) =>
  client.on('messageDelete', async (message: Message) => {
    if (!message.inGuild()) return;
    const { messageLogChannelId } = await getServer(message.guildId);
    if (!messageLogChannelId) return;
    const messageLogChannel = await message.guild.channels.fetch(
      messageLogChannelId,
      { cache: true }
    );
    if (!messageLogChannel) return;
    if (!messageLogChannel.isText()) return;

    const embed = new MessageEmbed()
      .setAuthor({
        name: message.member.displayName,
        iconURL: message.member.displayAvatarURL({
          dynamic: true
        })
      })
      .setDescription(
        `**Message sent by ${message.author} deleted from ${message.channel}**
${message.content}`
      )
      .setFooter({
        text: `Author ID: ${message.author.id} | Message ID: ${message.id}`
      })
      .setTimestamp(message.createdTimestamp);

    await messageLogChannel.send({ embeds: [embed] });
  });
