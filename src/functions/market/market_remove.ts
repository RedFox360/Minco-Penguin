import {
	ChatInputCommandInteraction,
	EmbedBuilder
} from 'discord.js';
import { getProfileInServer, updateProfileInServer } from '../models';
export default async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const profileInServer = await getProfileInServer(
		interaction.user.id,
		interaction.guildId
	);
	const itemName = interaction.options.getString('item-name');
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
	return new EmbedBuilder()
		.setDescription(`<:check_circle:872594799662858270> ${text}`)
		.setColor(0xb8ff8b);
}
