import { MessageEmbed } from 'discord.js';
import { randomInt } from 'mathjs';
import { time } from '@discordjs/builders';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import { hoursToMilliseconds } from 'date-fns';
const dayLength = hoursToMilliseconds(20);

const daily = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('daily')
      .setDescription('Claim your daily reward!')
  )
  .setRun(async interaction => {
    const profile = await getProfile(interaction.user.id);
    const now = Date.now();
    const { lastUsedDaily } = profile;

    if (lastUsedDaily && lastUsedDaily + dayLength > now) {
      const timeToWait = Math.floor(
        (lastUsedDaily + dayLength) / 1000
      );
      await interaction.reply({
        content: `You can use /daily again ${time(timeToWait, 'R')}`,
        ephemeral: true
      });
      return;
    }

    const dailyEmbed = new MessageEmbed()
      .setColor('#ffa845')
      .setTitle('Daily Reward')
      .setFooter({
        text: interaction.guild?.name ?? interaction.user.username
      });
    let upperLimit = 50;
    let description = '';
    if (profile.spouse) upperLimit = 65;
    else if (profile.inventory.includes('07')) upperLimit = 57;
    const randomAmount = randomInt(25, upperLimit);
    await updateProfile(
      {
        $inc: { mincoDollars: randomAmount },
        lastUsedDaily: now
      },
      interaction.user.id
    );
    description += `You earned ${randomAmount} Minco Dollars!`;
    if (Math.floor(Math.random() * 4) === 0) {
      if (profile.inventory.includes('05')) {
        await updateProfile(
          {
            $inc: { candyAmount: 3 }
          },
          interaction.user.id
        );
      } else {
        await updateProfile(
          {
            $push: { inventory: '05' },
            candyAmount: 3
          },
          interaction.user.id
        );
      }
      description += '\nYou also won a Candy :candy:!';
    }

    dailyEmbed.setDescription(description);
    await interaction.reply({ embeds: [dailyEmbed] });
  });

export default daily;
