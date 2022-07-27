import {
	ButtonStyle,
	ChannelType,
	ComponentType,
	EmbedBuilder
} from 'discord.js';
import { minutesToMilliseconds } from 'date-fns';
import { ButtonBuilder, ActionRowBuilder } from 'discord.js';
import checkProfanity from '../../functions/filter';
import {
	getProfileInServer,
	getServer
} from '../../functions/models';
import { SlashCommand } from '../../types';

const twominutes = minutesToMilliseconds(2);

const confess = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('confess')
			.setDescription('Submit a confession anonymously')
			.addStringOption(option =>
				option
					.setName('confession')
					.setDescription('Your confession')
					.setRequired(true)
			)
			.addChannelOption(option =>
				option
					.setName('channel')
					.setDescription('A channel to send your confession to')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const profileInServer = await getProfileInServer(
			interaction.user.id,
			interaction.guildId
		);
		if (
			profileInServer.bannedFromConfessions &&
			!(interaction.member.permissions as any).has(
				'MANAGE_MESSAGES'
			) &&
			interaction.user.id !== process.env.OWNER_ID
		) {
			await interaction.reply({
				content:
					'You were banned from sending confessions by a server manager',
				ephemeral: true
			});
			return;
		}

		const confession = interaction.options.getString('confession');
		if (
			(await getServer(interaction.guildId)).clean &&
			checkProfanity(confession)
		) {
			await interaction.reply({
				content: 'Please keep your confession clean!',
				ephemeral: true
			});
			return;
		}
		const channel =
			interaction.options.getChannel('channel') ??
			interaction.channel;

		if (channel.type !== ChannelType.GuildText) {
			await interaction.reply({
				content: 'That channel is invalid',
				ephemeral: true
			});
			return;
		}

		const embed = new EmbedBuilder()
			.setTitle('Anonymous Confession')
			.setDescription(`"${confession}"`)
			.setTimestamp()
			.setColor(Math.floor(Math.random() * 0xffffff));

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('delete')
				.setLabel('Delete')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('💥'),
			new ButtonBuilder()
				.setCustomId('reveal')
				.setLabel('Reveal')
				.setStyle(ButtonStyle.Danger)
				.setEmoji('🙂')
		);
		await interaction.reply({
			content: `Confession sent to <#${channel.id}>`,
			ephemeral: true
		});
		const msg = await channel.send({
			embeds: [embed],
			components: [row]
		});
		const collector = msg.createMessageComponentCollector({
			filter: i => i.customId === 'delete' || i.customId === 'reveal',
			time: twominutes,
			componentType: ComponentType.Button
		});
		let deleted = false;
		collector.on('collect', async buttonInteraction => {
			if (buttonInteraction.user.id !== interaction.user.id) {
				await buttonInteraction.reply({
					content:
						'These buttons can only be used by the author of the confession',
					ephemeral: true
				});
				return;
			}
			switch (buttonInteraction.customId) {
				case 'delete': {
					await msg.delete();
					deleted = true;
					break;
				}
				case 'reveal': {
					embed.setTitle('Confession');
					await msg.edit({
						embeds: [embed],
						components: [row],
						content: interaction.user.toString()
					});
					break;
				}
			}
		});
		collector.on('end', async () => {
			if (!deleted)
				await msg.edit({ embeds: [embed], components: [] });
		});
	});

export default confess;
