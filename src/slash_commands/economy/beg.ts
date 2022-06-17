import { randomInt } from 'mathjs';
import { utcToZonedTime } from 'date-fns-tz';
import { getDayOfYear, minutesToSeconds } from 'date-fns';
import {
  getProfile,
  getServer,
  updateProfile
} from '../../functions/models';
import { SlashCommand } from '../../types';

const beg = new SlashCommand()
  .setCommandData(builder =>
    builder.setName('beg').setDescription('Beg for Minco Dollars!')
  )
  .setCooldown(minutesToSeconds(6.5))
  .setRun(async interaction => {
    const profile = await getProfile(interaction.user.id);
    const { timezone } = await getServer(interaction.guildId);
    const dayOfTheWeek = utcToZonedTime(
      new Date(),
      timezone
    ).getDay();
    let response = '';
    let earnedMD = randomInt(4, 8);
    if (
      profile.birthday &&
      getDayOfYear(
        utcToZonedTime(new Date(profile.birthday), profile.timezone)
      ) === getDayOfYear(new Date()) &&
      Math.floor(Math.random() * 4) !== 0
    ) {
      earnedMD *= 2;
      response += 'You got your birthday double bonus!\n';
    }
    if (profile.inventory.includes('05')) {
      if (profile.candyAmount <= 0) {
        await updateProfile(
          {
            $pull: {
              inventory: '05'
            }
          },
          interaction.user.id
        );
      } else {
        await updateProfile(
          {
            $inc: {
              candyAmount: -1
            }
          },
          interaction.user.id
        );
        earnedMD *= 2;
        response += 'You got a double bonus from your candy!\n';
      }
    }
    if (Math.round(Math.random()) && dayOfTheWeek === 5) {
      earnedMD *= 2;
      response += 'You got the Friday double bonus!\n';
    } else if (
      Math.floor(Math.random() * 4) === 1 &&
      (dayOfTheWeek === 0 || dayOfTheWeek === 6)
    ) {
      earnedMD *= 2;
      response += 'You got the weekend double bonus!\n';
    }
    if (profile.spouse || profile.inventory.includes('07')) {
      const random = Math.floor(Math.random() * 100);
      const chance = profile.spouse ? 10 : 5;
      const mOrB = profile.spouse ? 'for marriage' : 'from your bear';
      if (random < chance) {
        earnedMD *= 2;
        response += `You got a double bonus ${mOrB}!\n`;
      }
    }
    await updateProfile(
      {
        $inc: { mincoDollars: earnedMD }
      },
      interaction.user.id
    );
    const mdString = earnedMD === 1 ? 'Dollar' : 'Dollars';
    response += `You received ${earnedMD} Minco ${mdString}!`;
    await interaction.reply(response);
  });

export default beg;
