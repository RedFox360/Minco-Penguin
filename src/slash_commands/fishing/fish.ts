import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	CommandInteraction,
	ComponentType
} from 'discord.js';
import { Profile } from 'mincomodels/profileSchema/types';
import { SlashCommand } from '../../types';
import emojis from '../../functions/fish/fish_emojis';
import { getProfile, updateProfile } from '../../functions/models';
import getFish from '../../functions/fish/fish_amounts';
import { EmbedBuilder } from 'discord.js';

const fish = new SlashCommand()
	.setCommandData(builder =>
		builder.setName('fish').setDescription('Fish for some fish')
	)
	.setCooldown(17.5 * 60)
	.setRun(async interaction => {
		const profile = await getProfile(interaction.user.id);
		if (!profile.fish.rod) {
			await handleNoRod(profile, interaction);
			return;
		}

		const fishCaught = getFish(profile.fish.rod, profile.fish.biome);
		const totalAmount = Object.values(fishCaught)
			.map(a => a.fishAmount)
			.reduce((a, c) => a + c);
		const resultEmbed = new EmbedBuilder()
			.setAuthor({
				name: 'You went fishing and caught...',
				iconURL: interaction.member.displayAvatarURL()
			})
			.setFooter({
				text: `Current biome: ${profile.fish.biome}`
			});
		// checking if all the fish equal 0
		if (Object.keys(fishCaught).length === 0) {
			resultEmbed
				.setDescription('Nothing! You were just really unlucky 🙁')
				.setColor(0xec7063);
			await interaction.reply({ embeds: [resultEmbed] });
			return;
		}
		resultEmbed.setColor(0xd5f5e3);
		// xp increases by 60% of the total fish amount
		const increaseXp = Math.round(0.6 * totalAmount);
		const { fishInventory } = profile.fish;
		for (const [fishName, fishData] of Object.entries(fishCaught)) {
			fishInventory.set(
				fishName,
				(fishInventory.get(fishName) ?? 0) + fishData.fishAmount
			);
			resultEmbed.addFields({
				name: `${fishData.emoji} ${capitalizeFirstLetter(
					fishData.fishAmount === 1
						? fishData.singular
						: fishData.plural
				)}`,
				value: `${fishData.fishAmount.toLocaleString(
					interaction.locale
				)}`,
				inline: true
			});
		}
		await updateProfile(
			{
				'fish.fishInventory': fishInventory,
				'fish.xp': profile.fish.xp + increaseXp
			},
			interaction.user.id
		);

		await interaction.reply({ embeds: [resultEmbed] });
	});

/* async function getAmount(userId: string, profile: Profile) {
	if (!profile.fish) return 0;
	const { baits, baitType } = profile.fish;
	if (!baits) return 0;
	if (baitType === 'fish') {
		await updateProfile({ $inc: { 'fish.baits': -1 } }, userId);
		return 4;
	}
	if (baitType === 'bug') {
		await updateProfile({ $inc: { 'fish.baits': -1 } }, userId);
		return 3;
	}
	if (baitType === 'leech') {
		await updateProfile({ $inc: { 'fish.baits': -1 } }, userId);
		return 2;
	}
	if (baitType === 'worm') {
		await updateProfile({ $inc: { 'fish.baits': -1 } }, userId);
		return 1;
	}
	return 0;
} */

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

async function handleNoRod(
	profile: Profile,
	interaction: CommandInteraction<'cached'>
) {
	const msg = await interaction.reply({
		embeds: [
			new EmbedBuilder()
				.setColor(0xec7063)
				.setDescription("You don't have a fishing rod!")
		],
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				new ButtonBuilder()
					.setCustomId('buy-rod')
					.setLabel('Buy a rod (100 MD)')
					.setStyle(ButtonStyle.Success)
					.setEmoji(emojis.rod)
			)
		],
		fetchReply: true
	});
	const collector = msg.createMessageComponentCollector({
		componentType: ComponentType.Button,
		time: 60_000,
		filter: i => i.customId === 'buy-rod'
	});

	collector.on('collect', async buttonInteraction => {
		if (buttonInteraction.user.id !== interaction.user.id) {
			await buttonInteraction.reply({
				content: 'These buttons are not for you',
				ephemeral: true
			});
			return;
		}
		if (profile.mincoDollars < 100) {
			await buttonInteraction.reply({
				content: "You don't have 100 MD in your wallet",
				ephemeral: true
			});
			return;
		}
		await updateProfile(
			{
				$inc: {
					mincoDollars: -100
				},
				'fish.rod': 'wooden'
			},
			interaction.user.id
		);
		await buttonInteraction.reply('You bought a wooden rod!');
	});
}

export default fish;
