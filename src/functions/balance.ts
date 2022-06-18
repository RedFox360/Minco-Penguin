import {
	CommandInteraction,
	GuildMember,
	MessageEmbed,
	UserContextMenuInteraction
} from 'discord.js';
import { getProfile } from './models';

export default async function run(
	interaction:
		| CommandInteraction<'cached'>
		| UserContextMenuInteraction<'cached'>,
	member: GuildMember
) {
	const profile = await getProfile(member.id);
	const total = profile.mincoDollars + profile.bank;
	const avatar = member.displayAvatarURL({ dynamic: true });
	const balanceEmbed = new MessageEmbed()
		.setAuthor({ name: 'Balance', iconURL: avatar })
		.setColor('#B8FF8B')
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
