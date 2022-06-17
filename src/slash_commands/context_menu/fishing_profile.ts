import fishingProfile from '../../functions/fishing_profile';
import { UserContextMenu } from '../../types';

const fishingProfileContextMenu = new UserContextMenu()
  .setCommandData(builder => builder.setName('Fishing profile'))
  .setRun(interaction =>
    fishingProfile(interaction, interaction.targetMember)
  );

export default fishingProfileContextMenu;
