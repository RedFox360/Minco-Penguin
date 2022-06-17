import marketView from '../../functions/market/market_view';
import { UserContextMenu } from '../../types';

const marketContextMenu = new UserContextMenu()
  .setCommandData(builder => builder.setName('Market'))
  .setRun(interaction =>
    marketView(interaction, interaction.targetUser)
  );

export default marketContextMenu;
