import { FishJSON } from '../../types';
import { randomInt } from 'mathjs';
import { getProfile, updateProfile } from '../models';
import fishEmojis from '../fish/fish_emojis';
import _fishJSON from '../../json/fish.json';
import { ChatInputCommandInteraction } from 'discord.js';
const fishJSON = _fishJSON as FishJSON;

export default async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const { fish } = await getProfile(interaction.user.id);
	if (!fish.fishInventory.size) {
		await interaction.reply({
			content: "You don't have any fish!",
			ephemeral: true
		});
		return;
	}

	const fishName = interaction.options.getString('fish_name');
	const fishData = fishJSON[fishName];
	if (!fishData) {
		await interaction.reply({
			content: "That isn't a valid fish",
			ephemeral: true
		});
		return;
	}
	if (
		!fish.fishInventory.has(fishName) ||
		fish.fishInventory.get(fishName) < 1
	) {
		await interaction.reply({
			content: "You don't have any of that fish!",
			ephemeral: true
		});
		return;
	}
	const originalAmount = fish.fishInventory.get(fishName);
	const amount =
		interaction.options.getInteger('amount') ?? originalAmount;
	if (amount < 1) {
		await interaction.reply({
			content: 'Please enter a positive amount of fish',
			ephemeral: true
		});
		return;
	}
	if (fish.fishInventory.get(fishName) < amount) {
		await interaction.reply({
			content: "You don't have that many fish",
			ephemeral: true
		});
		return;
	}
	const price = randomInt(fishData.minPrice, fishData.maxPrice + 1);
	const addEarnings = price * amount;
	fish.fishInventory.set(fishName, originalAmount - amount);
	await updateProfile(
		{
			'fish.fishInventory': fish.fishInventory,
			$inc: {
				mincoDollars: addEarnings
			}
		},
		interaction.user.id
	);
	const name =
		amount === 1
			? fishData.formattedNames[0]
			: fishData.formattedNames[1];
	await interaction.reply(
		`You sold ${amount} ${fishEmojis[fishName]} ${name} for ${addEarnings} MD`
	);
}
