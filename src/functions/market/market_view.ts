import {
	CommandInteraction,
	MessageEmbed,
	User,
	UserContextMenuInteraction
} from 'discord.js';
import { getProfileInServer } from '../models';
export default async function run(
	interaction:
		| CommandInteraction<'cached'>
		| UserContextMenuInteraction<'cached'>,
	user: User
) {
	const { market } = await getProfileInServer(
		user.id,
		interaction.guildId
	);
	if (!market.length) {
		await interaction.reply({
			content: `${user} doesn't have anything in their market`
		});
		return;
	}
	const marketEmbed = new MessageEmbed()
		.setColor('#D1F2EB')
		.setTitle('Market')
		.setDescription(`User: ${user}`)
		.setFooter({
			text: interaction.guild?.name ?? interaction.user.username
		});
	for (const { name, price, desc } of market) {
		let value = `Price: ${price.toLocaleString(
			interaction.locale
		)} MD`;
		if (desc) value += `\n${desc}`;
		marketEmbed.addField(name, value);
	}
	await interaction.reply({ embeds: [marketEmbed] });
}
