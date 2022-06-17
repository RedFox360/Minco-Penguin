import { SlashCommand } from '../../types';

const coinflip = new SlashCommand()
  .setCommandData(builder =>
    builder.setName('coinflip').setDescription('Flip a coin!')
  )
  .setRun(async interaction => {
    {
      if (Math.round(Math.random())) {
        await interaction.reply(':coin: Heads');
      } else {
        await interaction.reply(':coin: Tails');
      }
    }
  });

export default coinflip;
