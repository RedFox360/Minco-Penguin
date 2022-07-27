import {
	ButtonBuilder,
	ActionRowBuilder,
	ChatInputCommandInteraction,
	ButtonStyle,
	ComponentType
} from 'discord.js';
import {
	getProfileInServer,
	getProfile,
	updateProfile
} from '../models';
export default async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const profile = await getProfile(interaction.user.id);
	const user = interaction.options.getUser('user');
	const itemName = interaction.options.getString('item-name');
	const uprofile = await getProfileInServer(
		interaction.user.id,
		interaction.guildId
	);
	const item = uprofile.market.find(m => m.name === itemName);
	if (!item) {
		await interaction.reply({
			content: `${user} does not have that item! (remember capitalization)`,
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
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm')
			.setStyle(ButtonStyle.Success),
		new ButtonBuilder()
			.setCustomId('reject')
			.setLabel('Nevermind')
			.setStyle(ButtonStyle.Danger)
	);
	const msg = await interaction.reply({
		content: `${interaction.user}, confirm to buy ${item.name} for ${item.price} MD`,
		components: [row],
		fetchReply: true
	});

	const collector = msg.createMessageComponentCollector({
		filter: i => i.customId === 'confirm' || i.customId === 'reject',
		time: 10_000,
		max: 1,
		componentType: ComponentType.Button
	});
	collector.on('collect', async buttonInteraction => {
		if (buttonInteraction.user.id !== interaction.user.id) {
			await interaction.reply({
				content:
					'These buttons are only for the author of the message'
			});
			return;
		}
		if (buttonInteraction.customId === 'confirm') {
			await updateProfile(
				{ $inc: { mincoDollars: -item.price } },
				buttonInteraction.user.id
			);
			await updateProfile(
				{ $inc: { mincoDollars: item.price } },
				buttonInteraction.user.id
			);
			try {
				await user.send(
					`${interaction.user} bought your **${item.name}**`
				);
				await buttonInteraction.reply(
					`You succesfully bought that item! ${user} will be DMed notifying your purchase.`
				);
			} catch {
				await buttonInteraction.reply(
					`You succesfully bought that item! However, ${user} has blocked the bot or disabled DM perms so Minco Penguin could not notify them.`
				);
			}
		} else {
			await buttonInteraction.reply({
				content: 'Request canceled',
				ephemeral: true
			});
		}
	});
	collector.on('end', async (_, reason) => {
		if (reason === 'idle')
			await interaction.followUp({
				content: 'Timed out!',
				ephemeral: true
			});
	});
}
