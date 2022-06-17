import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../types';

const poll = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('poll')
      .setDescription(
        'Send a poll to the channel with thumbsup and thumbsdown reactions'
      )
      .addStringOption(option =>
        option
          .setName('question')
          .setDescription('The question you want to ask')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('emoji_1')
          .setDescription('The first emoji in the poll')
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('emoji_2')
          .setDescription('The second emoji in the poll')
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('emoji_3')
          .setDescription('(optional) The third emoji in the poll')
          .setRequired(false)
      )
      .addStringOption(option =>
        option
          .setName('emoji_4')
          .setDescription('(optional) The fourth emoji in the poll')
          .setRequired(false)
      )
  )
  .setRun(async interaction => {
    const question = interaction.options.getString('question');
    let emoji1 = interaction.options.getString('emoji_1') ?? '👍';
    let emoji2 = interaction.options.getString('emoji_2') ?? '👎';
    const emoji3 = interaction.options.getString('emoji_3');
    const emoji4 = interaction.options.getString('emoji_4');
    if (emoji1 < 'ÿ') emoji1 = '👍';
    if (emoji2 < 'ÿ') emoji2 = '👎';
    const pollEmbed = new MessageEmbed()
      .setTitle('Poll')
      .setDescription(question)
      .setColor('BLUE')
      .setFooter({
        text: interaction.guild?.name ?? interaction.user.username
      });

    const msg = await interaction.reply({
      embeds: [pollEmbed],
      fetchReply: true
    });
    await msg.react(emoji1);
    await msg.react(emoji2);
    if (emoji3 && emoji3 > 'ÿ') await msg.react(emoji3);
    if (emoji4 && emoji4 > 'ÿ') await msg.react(emoji4);
  });

export default poll;
