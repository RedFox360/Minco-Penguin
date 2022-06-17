import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../types';
const validImageSizes = [
  '16',
  '32',
  '56',
  '64',
  '96',
  '128',
  '256',
  '300',
  '512',
  '600',
  '1024',
  '2048',
  '4096'
];
const banner = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('banner')
      .setDescription(
        'View your banner or the banner of another user'
      )
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to view the banner of')
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('size')
          .setDescription('The banner size (default = 1024)')
          .addChoices(validImageSizes.map(i => [i, i]))
          .setRequired(false)
      )
  )
  .setRun(async interaction => {
    const user = await interaction.options.getUser('user').fetch();
    if (!user.banner) {
      await interaction.reply(`${user} doesn't have a banner!`);
      return;
    }
    const sizeOption = interaction.options.getString('size');
    const size = sizeOption ? parseInt(sizeOption) : 1024;
    const banner = user.bannerURL({
      dynamic: true,
      size: size as any
    });
    const embed = new MessageEmbed()
      .setColor(user.accentColor)
      .setTitle('Banner')
      .setDescription(
        `[${user.username}'s banner image link](${banner})`
      )
      .setImage(banner)
      .setFooter({ text: user.tag })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  });

export default banner;
