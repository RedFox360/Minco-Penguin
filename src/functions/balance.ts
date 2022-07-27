import {
	ChatInputCommandInteraction,
	EmbedBuilder
} from 'discord.js';
import {
	GuildMember,
	UserContextMenuCommandInteraction
} from 'discord.js';
import { getProfile } from './models';

export default async function run(
	interaction:
		| ChatInputCommandInteraction<'cached'>
		| UserContextMenuCommandInteraction<'cached'>,
	member: GuildMember
) {
	const profile = await getProfile(member.id);
	const total = profile.mincoDollars + profile.bank;
	const avatar = member.displayAvatarURL();
	const balanceEmbed = new EmbedBuilder()
		.setAuthor({
			name: `${member.displayName}'s Balance`,
			iconURL: avatar
		})
		.setColor(0xb8ff8b)
		.setDescription(
			`🪙 Wallet: **${profile.mincoDollars.toLocaleString(
				interaction.locale
			)}** Minco Dollars
💵 Bank: **${profile.bank.toLocaleString(
				interaction.locale
			)}** Minco Dollars
💰 Total: **${total.toLocaleString(
				interaction.locale
			)}** Minco Dollars`
		);
	await interaction.reply({ embeds: [balanceEmbed] });
}
