import balance from '../../functions/balance';
import { SlashCommand } from '../../types';

const balanceCommand = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('balance')
      .setDescription('View your balance of Minco Dollars!')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to view the balance of')
          .setRequired(false)
      )
  )
  .setRun(async interaction => {
    const member =
      interaction.options.getMember('user') ?? interaction.member;
    await balance(interaction, member);
  });

export default balanceCommand;
