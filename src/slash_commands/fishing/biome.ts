import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  EmojiResolvable
} from 'discord.js';
import { hoursToMilliseconds } from 'date-fns';

const biome = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('biome')
      .setDescription('View and change your biome')
  )
  .setCooldown(15)
  .setRun(async interaction => {
    const profile = await getProfile(interaction.user.id);
    if (!profile.fish || !profile.fish.rod) {
      await interaction.reply({
        content:
          'You need to buy a rod using /upgrade before managing your biomes',
        ephemeral: true
      });
      return;
    }
    const unlockedOptionsValues = ['ocean'];
    if (profile.fish.xp >= 1000) unlockedOptionsValues.push('river');
    if (profile.fish.xp >= 2000) unlockedOptionsValues.push('pond');
    if (profile.fish.xp >= 3000)
      unlockedOptionsValues.push('warm ocean');
    if (profile.fish.xp >= 4000) unlockedOptionsValues.push('beach');
    if (profile.fish.xp >= 5000)
      unlockedOptionsValues.push('lush cave');

    let row: MessageActionRow;
    if (unlockedOptionsValues.length > 1)
      row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
          .setCustomId('biomes-select')
          .setPlaceholder('Switch biomes')
          .setMaxValues(1)
          .addOptions(
            biomeMenu.filter(i =>
              unlockedOptionsValues.includes(i.value)
            )
          )
      );

    const biomesEmbed = new MessageEmbed()
      .setColor('#5DADE2')
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.displayAvatarURL({
          dynamic: true
        })
      })
      .setTitle('Biome Choices')
      .setDescription(
        biomeMenu
          .map(a =>
            formatBiome(a, !unlockedOptionsValues.includes(a.value))
          )
          .join('\n')
      )
      .setFooter({
        text: `Current biome: ${profile.fish.biome}`
      });

    if (!row) {
      await interaction.reply({
        embeds: [biomesEmbed]
      });
      return;
    }

    const msg = await interaction.reply({
      embeds: [biomesEmbed],
      components: row ? [row] : undefined,
      fetchReply: true
    });
    const collector = msg.createMessageComponentCollector({
      componentType: 'SELECT_MENU',
      filter: i => i.customId === 'biomes-select',
      time: hoursToMilliseconds(2)
    });

    collector.on('collect', async selectMenuInteraction => {
      if (selectMenuInteraction.user.id !== interaction.user.id) {
        await selectMenuInteraction.reply({
          content: `These buttons are only for the author of the message`,
          ephemeral: true
        });
        return;
      }

      const selected = selectMenuInteraction.values[0];
      const biome = biomeMenu.find(a => a.value === selected);
      await updateProfile(
        {
          'fish.biome': selected
        },
        selectMenuInteraction.user.id
      );
      await selectMenuInteraction.reply(
        `You switched to the ${biome.emoji} ${biome.label} biome!`
      );
    });
  });

const biomeMenu = [
  {
    label: 'Ocean',
    value: 'ocean',
    emoji: '🌊',
    description: '0 EXP',
    xp: 0
  },
  {
    label: 'River',
    value: 'river',
    emoji: '🦦',
    description: '1000 EXP',
    xp: 1000
  },
  {
    label: 'Pond',
    value: 'pond',
    emoji: '💧',
    description: '2000 EXP',
    xp: 2000
  },
  {
    label: 'Warm Ocean',
    value: 'warm ocean',
    emoji: '<:coral:967518451335848026>',
    description: '3000 EXP',
    xp: 3000
  },
  {
    label: 'Beach',
    value: 'beach',
    emoji: '🌴',
    description: '4000 EXP',
    xp: 4000
  },
  {
    label: 'Lush Cave',
    value: 'lush cave',
    emoji: '🌿',
    description: '5000 EXP',
    xp: 5000
  }
];

function formatBiome(
  biome: {
    label: string;
    value: string;
    emoji: EmojiResolvable;
    xp: number;
  },
  isLocked: boolean
) {
  return `${isLocked ? '🔒' : ''} ${biome.emoji} **${
    biome.label
  }** | ${biome.xp} EXP`;
}

export default biome;
