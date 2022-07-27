import { ButtonStyle, ComponentType, EmbedBuilder } from 'discord.js';
import { hoursToMilliseconds } from 'date-fns';
import { ButtonBuilder, ActionRowBuilder } from 'discord.js';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const collectorTime = hoursToMilliseconds(3);
const propose = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('propose')
			.setDescription('Propose to a member of the server')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to propose to')
					.setRequired(true)
			)
	)
	.setCooldown(25 * 60)
	.setRun(async interaction => {
		const { spouse, inventory } = await getProfile(
			interaction.user.id
		);
		if (spouse) {
			await interaction.reply({
				content:
					'You are already married! You can divorce your current spouse by using /divorce to marry a new user',
				ephemeral: true
			});
			return;
		}
		if (!inventory.includes('01')) {
			await interaction.reply({
				content:
					":ring: You don't have a marriage ring! You can buy a marriage ring using the /buy command",
				ephemeral: true
			});
			return;
		}
		const user = interaction.options.getUser('user');
		const { spouse: userSpouse } = await getProfile(user.id);
		if (user.id === interaction.user.id) {
			await interaction.reply({
				content: "You can't marry yourself!",
				ephemeral: true
			});
			return;
		}
		if (user.bot) {
			await interaction.reply({
				content: "You can't marry a bot!",
				ephemeral: true
			});
			return;
		}
		if (userSpouse) {
			await interaction.reply({
				content: `${user} is already married!`,
				ephemeral: true
			});
			return;
		}
		const acceptButton = new ButtonBuilder()
			.setCustomId('accept_proposal')
			.setLabel('Accept Proposal')
			.setEmoji('💍')
			.setStyle(ButtonStyle.Success);
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			acceptButton
		);
		const proposal = new EmbedBuilder()
			.setColor(0x85c1e9) // light blue
			.setAuthor({
				name: 'Proposal',
				iconURL: interaction.member.displayAvatarURL()
			})
			.setDescription(
				`**${user}, ${interaction.user} has proposed to you**. Click the "Accept Proposal" button to marry ${interaction.user}. The button will not work after 3 hours.
		
Benefits of marriage:
\`\`\`md
1. Chance of doubling beg
2. Higher amount of money from math
3. Higher amount of money from /daily and /weekly
\`\`\``
			)
			.setFooter({
				text: "Don't feel like marrying someone? /buy a bear to get similar rewards!"
			});
		const msg = await interaction.reply({
			embeds: [proposal],
			components: [row],
			fetchReply: true
		});
		const collector = msg.createMessageComponentCollector({
			filter: i => i.customId === 'accept_proposal',
			max: 1,
			time: collectorTime,
			componentType: ComponentType.Button
		});
		collector.on('collect', async buttonInteraction => {
			if (buttonInteraction.user.id !== user.id) {
				await interaction.reply({
					content: `This button is only for ${user}`,
					ephemeral: true
				});
				return;
			}
			await updateProfile(
				{ spouse: buttonInteraction.user.id },
				interaction.user.id
			);
			await updateProfile(
				{ spouse: interaction.user.id },
				buttonInteraction.user.id
			);
			await buttonInteraction.reply(
				`:bouquet: ${user} and ${interaction.user} are now married!`
			);
		});
	});

export default propose;
