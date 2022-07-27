import {
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
	ComponentType,
	EmbedBuilder
} from 'discord.js';
import { hoursToMilliseconds } from 'date-fns';
import {
	Collection,
	GuildMember,
	ActionRowBuilder,
	ButtonBuilder
} from 'discord.js';
import chunkArray from '../../functions/basics/chunk_array';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
const chunkSize = 15;
const collectorTime = hoursToMilliseconds(12);

const leaderboard = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('leaderboard')
			.setDescription(
				'View the Minco Dollar leaderboard of the server'
			)
	)
	.setRun(run);

async function run(
	interaction:
		| ChatInputCommandInteraction<'cached'>
		| ButtonInteraction<'cached'>,
	ephemeral = false,
	profiles?: any[],
	currentPage = 0
) {
	await interaction.deferReply({ ephemeral });
	let members: Collection<string, GuildMember>;
	try {
		members = await interaction.guild.members.fetch({
			limit: 500
		});
	} catch (err) {
		await interaction.reply({
			content:
				'Sorry, Minco Penguin could not fetch the members of this server in time. Please try using the command again',
			ephemeral: true
		});
		return;
	}
	if (!profiles) {
		const nonBots = members.filter(member => !member.user.bot);
		const profilePromises = nonBots.map(member =>
			getProfile(member.id)
		);
		profiles = (await Promise.all(profilePromises))
			.filter(a => a != null)
			.map((profile, index) => {
				const total = profile.mincoDollars + profile.bank;
				return [
					`${nonBots.at(index).displayName}: **${total.toLocaleString(
						interaction.locale
					)} MD**`,
					total,
					nonBots.at(index).id
				];
			});
	}
	const formatted = profiles
		.sort((a, b) => b[1] - a[1])
		.map((val, index) => [
			`**${index + 1}** ${val[0]}`,
			val[1],
			val[2]
		]);
	const slices = chunkArray(formatted, chunkSize);
	const authorIndex = profiles.findIndex(
		e => e[2] === interaction.user.id
	);

	const first = new ButtonBuilder()
		.setCustomId('first')
		.setStyle(ButtonStyle.Primary)
		.setEmoji('⏪')
		.setDisabled(currentPage === 0);
	const previous = new ButtonBuilder()
		.setCustomId('prev')
		.setStyle(ButtonStyle.Primary)
		.setEmoji('⬅️')
		.setDisabled(currentPage === 0);
	const next = new ButtonBuilder()
		.setCustomId('next')
		.setEmoji('➡️')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(currentPage === slices.length - 1);
	const last = new ButtonBuilder()
		.setCustomId('last')
		.setEmoji('⏩')
		.setStyle(ButtonStyle.Primary)
		.setDisabled(currentPage === slices.length - 1);

	const length = slices.length;
	const inCirculation = profiles.reduce(
		(acc, profile) => acc + profile[1],
		0
	);
	const getDescription =
		() => `Minco Dollars in circulation: **${inCirculation.toLocaleString(
			interaction.locale
		)}**
		
${format(slices[currentPage])}`;

	const getFooter = () =>
		`Page ${currentPage + 1}/${length} • Your leaderboard rank: ${
			authorIndex + 1
		}`;
	const lbEmbed = new EmbedBuilder()
		.setTitle('Leaderboard')
		.setColor(0xe67e22) // orange
		.setDescription(getDescription())
		.setFooter({
			text: getFooter()
		});
	await interaction.editReply({
		embeds: [lbEmbed],
		components: [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				first,
				previous,
				next,
				last
			)
		]
	});
	const msg = await interaction.fetchReply();
	if (length === 1) return;
	const collector = msg.createMessageComponentCollector({
		time: collectorTime,
		componentType: ComponentType.Button
	});

	collector.on('collect', async buttonInteraction => {
		if (!buttonInteraction.inCachedGuild()) return;
		if (buttonInteraction.user.id !== interaction.user.id) {
			await run(buttonInteraction, true, profiles, currentPage);
			return;
		}
		switch (buttonInteraction.customId) {
			case 'first': {
				currentPage = 0;
				first.setDisabled();
				previous.setDisabled();
				next.setDisabled(false);
				last.setDisabled(false);
				lbEmbed.setDescription(getDescription()).setFooter({
					text: getFooter()
				});
				await buttonInteraction.update({
					embeds: [lbEmbed],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							first,
							previous,
							next,
							last
						)
					]
				});
				break;
			}
			case 'prev': {
				currentPage--;
				next.setDisabled(false);
				last.setDisabled(false);
				if (currentPage === 0) {
					previous.setDisabled();
					first.setDisabled();
				}
				lbEmbed.setDescription(getDescription()).setFooter({
					text: getFooter()
				});
				await buttonInteraction.update({
					embeds: [lbEmbed],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							first,
							previous,
							next,
							last
						)
					]
				});
				break;
			}
			case 'next': {
				currentPage++;
				previous.setDisabled(false);
				first.setDisabled(false);
				if (currentPage + 1 === length) {
					next.setDisabled();
					last.setDisabled();
				}
				lbEmbed.setDescription(getDescription()).setFooter({
					text: getFooter()
				});
				await buttonInteraction.update({
					embeds: [lbEmbed],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							first,
							previous,
							next,
							last
						)
					]
				});
				break;
			}
			case 'last': {
				currentPage = length - 1;
				previous.setDisabled(false);
				first.setDisabled(false);
				next.setDisabled();
				last.setDisabled();
				lbEmbed.setDescription(getDescription()).setFooter({
					text: getFooter()
				});
				await buttonInteraction.update({
					embeds: [lbEmbed],
					components: [
						new ActionRowBuilder<ButtonBuilder>().addComponents(
							first,
							previous,
							next,
							last
						)
					]
				});
				break;
			}
		}
	});
}
function format(arr) {
	return arr.map(a => a[0]).join('\n');
}

export default leaderboard;
