import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getProfileInServer, updateProfileInServer } from '../models';
export default async function run(
  interaction: CommandInteraction<'cached'>
) {
  const profileInServer = await getProfileInServer(
    interaction.user.id,
    interaction.guildId
  );
  const itemName = interaction.options.getString('item_name');
  if (!profileInServer.market.find(i => i.name === itemName)) {
    await interaction.reply({
      content: "You don't have this item! (remember capitalization)",
      ephemeral: true
    });
    return;
  }

  updateProfileInServer(
    { $pull: { market: { name: itemName } } },
    interaction.user.id,
    interaction.guildId
  );

  await interaction.reply({
    embeds: [
      accepted(`**${itemName} ** has been removed from your market.`)
    ]
  });
}
function accepted(text: string) {
  return new MessageEmbed()
    .setDescription(`<:check_circle:872594799662858270> ${text}`)
    .setColor('#B8FF8B');
}
