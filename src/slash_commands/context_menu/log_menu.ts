import viewLogs from '../../functions/view_logs';
import { UserContextMenu } from '../../types';

const logs = new UserContextMenu()
  .setCommandData(builder => builder.setName('Moderation logs'))
  .setRun(interaction =>
    viewLogs(
      interaction,
      false,
      interaction.targetMember,
      interaction.targetUser
    )
  );

export default logs;
