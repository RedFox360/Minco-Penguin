import { SlashCommand } from '../../types';

const responses = [
  '🔴 You are lying!',
  '🟢 You are telling the truth!',
  '🟡 hmmm... I need more info!',
  '🟢 I think you are telling the truth',
  '🔴 You are DEFINITELY lying'
] as const;

const lieDetector = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('lie_detector')
      .setDescription('Check if you are lying')
      .addStringOption(option =>
        option
          .setName('question')
          .setDescription('A question')
          .setRequired(true)
      )
  )
  .setRun(async interaction => {
    const randomResponse =
      responses[Math.floor(Math.random() * responses.length)];
    const question = interaction.options.getString('question');

    await interaction.reply(`**${randomResponse}**\n*${question}*`);
  });

export default lieDetector;
