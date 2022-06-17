import fishingProfile from '../../functions/fishing_profile';
import { SlashCommand } from '../../types';

const profile = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('profile')
      .setDescription('View your fishing profile!')
      .addUserOption(option =>
        option
          .setName('user')
          .setDescription('The user to view the profile of')
          .setRequired(false)
      )
  )
  .setRun(async interaction => {
    const member =
      interaction.options.getMember('user') ?? interaction.member;
    await fishingProfile(interaction, member);
  });

export default profile;
