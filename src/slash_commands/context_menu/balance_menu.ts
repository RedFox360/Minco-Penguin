import { UserContextMenu } from '../../types';
import balance from '../../functions/balance';

const balanceContextMenu = new UserContextMenu()
  .setCommandData(builder => builder.setName('Balance'))
  .setRun(interaction =>
    balance(interaction, interaction.targetMember)
  );

export default balanceContextMenu;
