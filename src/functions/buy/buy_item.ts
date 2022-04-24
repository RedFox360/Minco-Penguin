import {
	CommandInteraction,
	MessageActionRow,
	MessageSelectMenu
} from 'discord.js';
import shop from '../../json/itemShop.json';
import { getProfile, updateProfile } from '../models';
import { hoursToMilliseconds } from 'date-fns';

const collectorTime = hoursToMilliseconds(2);
const prices = [
	75, 900, 25, 4, 33, 75, 400, 50, 50, 50, 8, 10
] as const;

export default async function run(
	interaction: CommandInteraction<'cached'>
) {
	const row = new MessageActionRow().addComponents(
		new MessageSelectMenu()
			.setCustomId('items-select')
			.setPlaceholder('Minco Shop')
			.addOptions(shop)
	);
	const msg = await interaction.reply({
		content: 'Choose an item from the Minco Shop',
		components: [row],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		componentType: 'SELECT_MENU',
		time: collectorTime,
		max: 10
	});

	collector.on('collect', async selectMenuInteraction => {
		const profile = await getProfile(
			selectMenuInteraction.user.id
		);
		const value = selectMenuInteraction.values[0];
		if (profile.inventory.includes(value)) {
			await selectMenuInteraction.reply({
				content: 'You already have this item!',
				ephemeral: true
			});
			return;
		}
		const price = prices[parseInt(value) - 1];
		if (profile.mincoDollars < price) {
			await selectMenuInteraction.reply({
				content:
					"You don't have enough Minco Dollars to buy this item!",
				ephemeral: true
			});
			return;
		}
		await updateProfile(
			{
				$push: { inventory: value }
			},
			selectMenuInteraction.user.id
		);
		if (value === '05') {
			await updateProfile(
				{ candyAmount: 3 },
				selectMenuInteraction.user.id
			);
		}
		await updateProfile(
			{
				$inc: { mincoDollars: -price }
			},
			selectMenuInteraction.user.id
		);
		const item = shop.find(i => i.value === value);
		await selectMenuInteraction.reply(
			`${selectMenuInteraction.user}, you succesfully bought a(n) ${item.emoji} **${item.label}** for ${price} MD`
		);
	});
}
