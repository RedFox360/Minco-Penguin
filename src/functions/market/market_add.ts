import { CommandInteraction, MessageEmbed } from 'discord.js';
import { getProfileInServer, updateProfileInServer } from '../models';
export default async function run(
	interaction: CommandInteraction<'cached'>
) {
	const { market } = await getProfileInServer(
		interaction.user.id,
		interaction.guildId
	);
	const price = interaction.options.getInteger('price');
	const itemName = interaction.options.getString('item_name');
	const desc = interaction.options.getString('description');

	for (const m of market) {
		if (itemName.toLowerCase() === m.name.toLowerCase()) {
			// eslint-disable-next-line no-await-in-loop
			await interaction.reply({
				content: 'You already have this item in your market!',
				ephemeral: true
			});
			return;
		}
	}

	await updateProfileInServer(
		{
			$push: {
				market: {
					$each: [{ name: itemName, desc, price }],
					$sort: { price: -1 }
				}
			}
		},
		interaction.user.id,
		interaction.guildId
	);
	const text = desc
		? `**${itemName}** | ${desc} for ${price} MD has been added to your market.`
		: `**${itemName}** for ${price} MD has been added to your market.`;
	await interaction.reply({ embeds: [accepted(text)] });
}

function accepted(text: string) {
	return new MessageEmbed()
		.setDescription(`<:check_circle:872594799662858270> ${text}`)
		.setColor('#B8FF8B');
}
