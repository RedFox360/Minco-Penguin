import {
  MessageEmbed,
  MessageActionRow,
  MessageButton
} from 'discord.js';
import { getProfile, updateProfile } from '../../functions/models';
import _rodInfo from '../../json/rod_info.json';
import { SlashCommand } from '../../types';
import { RodJSON } from '../../types';
import gemNumberToName from '../../functions/gem_number_to_name';
const rodInfo = _rodInfo as RodJSON;
const upgrade = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('upgrade')
      .setDescription('Upgrade your fishing rod to the next tier')
  )
  .setCooldown(45)
  .setRun(async interaction => {
    const userId = interaction.user.id;
    const { fish, gems, mincoDollars } = await getProfile(userId);
    const { rod } = fish;
    if (rod === 'obsidian') {
      await interaction.reply(
        "You already have the highest tier rod (obsidian)! You can't upgrade it anymore."
      );
      return;
    }
    const rodData = getRodToUpgrade(rod);
    if (fish.xp < rodData.xp) {
      await interaction.reply({
        content: `You need ${rodData.xp} fish XP to upgrade to the **${rodData.name}** rod. You currently have ${fish.xp} xp.`,
        ephemeral: true
      });
      return;
    }
    if (rodData.gem && !gems.includes(rodData.gem)) {
      await interaction.reply({
        content: `You need a(n) ${gemNumberToName(
          rodData.gem
        )} to buy a(n) ${rodData.name} rod`,
        ephemeral: true
      });
    }
    const priceFormat = rodData.price.toLocaleString(
      interaction.locale
    );
    if (mincoDollars < rodData.price) {
      await interaction.reply({
        content: `You don't have enough money to buy a(n) ${rodData.name} rod The **${rodData.name}** rod costs ${priceFormat} MD. You currently have ${mincoDollars} MD in your wallet.`,
        ephemeral: true
      });
      return;
    }
    const upgradeButton = new MessageButton()
      .setCustomId('upgrade')
      .setLabel('Upgrade')
      .setStyle('SUCCESS');
    const row = new MessageActionRow().addComponents(upgradeButton);
    const upgradeEmbed = new MessageEmbed()
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL()
      })
      .setTitle('Upgrade rod')
      .setDescription(
        `Price: **${priceFormat} MD**
Click the "Upgrade" button to upgrade your ${rod} rod to a(n) **${rodData.name}** rod
This button will not work after 10 minutes
Benefits: \`${rodData.benefits}\``
      )
      .setColor('#D5f5E3')
      .setFooter({
        text: `${interaction.guild.name} | Current xp: ${fish.xp}`
      })
      .setTimestamp();

    const msg = await interaction.reply({
      embeds: [upgradeEmbed],
      components: [row],
      fetchReply: true
    });
    const collector = msg.createMessageComponentCollector({
      filter: i => i.customId === 'upgrade',
      max: 1,
      componentType: 'BUTTON',
      time: 600_000 // 10 minutes
    });
    collector.on('collect', async buttonInteraction => {
      if (buttonInteraction.user.id !== userId) {
        await buttonInteraction.reply({
          content: `These buttons are for <@${userId}>`,
          ephemeral: true
        });
        return;
      }
      await updateProfile(
        {
          $inc: { mincoDollars: -rodData.price },
          'fish.rod': rodData.name
        },
        userId
      );
      await buttonInteraction.reply(
        `You upgraded to a **${rodData.name}** rod for ${priceFormat} Minco Dollars!`
      );
    });
  });

function getRodToUpgrade(rod: string) {
  if (rod) {
    const currentRod = rodInfo.find(a => a.name === rod);
    const toUpgrade = rodInfo.find(
      a => a.name === currentRod.rodToUpgrade
    );
    return toUpgrade;
  } else {
    return rodInfo[0];
  }
}

export default upgrade;
