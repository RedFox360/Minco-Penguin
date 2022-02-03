import { CommandData } from '../../types';
import {
	MessageButton,
	MessageActionRow,
	MessageComponentInteraction
} from 'discord.js';

export default async function run({
	interaction,
	profileInServerOf,
	profile,
	updateProfile
}: CommandData) {
	const user = interaction.options.getUser('user');
	const itemName = interaction.options.getString('item_name');
	const uprofile = await profileInServerOf(user.id);
	const item = uprofile.market.find((m) => m.name === itemName);
	if (!item) {
		await interaction.reply({
			content: `${user.toString()} does not have that item! (remember capitalization)`,
			ephemeral: true
		});
		return;
	}
	if (profile.mincoDollars < item.price) {
		await interaction.reply({
			content: `You don't have ${item.price} MD (the price of the item)`,
			ephemeral: true
		});
		return;
	}
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle('SUCCESS'),
		new MessageButton()
			.setCustomId('reject')
			.setLabel('Nevermind')
			.setStyle('DANGER')
	);
	const msg = await interaction.reply({
		content: `${interaction.user.toString()}, confirm to buy ${
			item.name
		} for ${item.price} MD`,
		components: [row],
		fetchReply: true
	});

	const filter = (i) =>
		(i.customId === 'confirm' || i.customId === 'reject') &&
		i.user.id === interaction.user.id;

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 10_000,
		max: 1
	});
	let sendTimeout = true;
	collector.on('collect', async (i: MessageComponentInteraction) => {
		if (!i.isMessageComponent()) return;
		sendTimeout = false;
		await i.deferUpdate();
		if (i.customId === 'confirm') {
			await updateProfile({ $inc: { mincoDollars: -item.price } });
			await updateProfile(
				{ $inc: { mincoDollars: item.price } },
				user.id
			);
			try {
				await user.send(
					`${interaction.user.toString()} bought your **${
						item.name
					}**`
				);
				await interaction.followUp(
					`You succesfully bought that item! ${user.toString()} will be DMed notifying your purchase.`
				);
			} catch (err) {
				await interaction.followUp(
					`You succesfully bought that item, but ${user}'s DMS are closed.`
				);
			}
		} else {
			await interaction.followUp('Request canceled');
		}
	});
	collector.on('end', async () => {
		if (sendTimeout)
			await interaction.followUp({
				content: 'Timed out!',
				ephemeral: true
			});
	});
}
