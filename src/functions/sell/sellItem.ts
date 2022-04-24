import { CommandInteraction } from 'discord.js';
import { getProfile, updateProfile } from '../models';

const sellableItems = [
	'Ring',
	'Crown',
	'Cowboy Hat',
	'Jellyfish',
	'Bear',
	'Cactus',
	'Fire'
];
const sellableItemNumbers = [
	'01',
	'02',
	'03',
	'06',
	'07',
	'08',
	'09'
] as const;
const returnAmounts = [40, 500, 15, 40, 250, 30, 30, 30] as const;

export default async function sellItem(
	interaction: CommandInteraction<'cached'>
) {
	const itemName = interaction.options.getString('item_name');

	const index = sellableItems.indexOf(itemName);
	if (index === -1) {
		await interaction.reply({
			content: `You can't sell that item!
Sellable items are:
\`\`\`
${sellableItems.join(', ')}
\`\`\``,
			ephemeral: true
		});
		return;
	}
	const itemNumber = sellableItemNumbers[index];
	const profile = await getProfile(interaction.user.id);
	if (!profile.inventory.includes(itemNumber)) {
		await interaction.reply({
			content: "You don't have that item!",
			ephemeral: true
		});
		return;
	}
	const returnAmount = returnAmounts[index];

	await updateProfile(
		{
			$pull: { inventory: itemNumber },
			$inc: { mincoDollars: returnAmount }
		},
		interaction.user.id
	);

	await interaction.reply('You succesfully sold your item');
}
