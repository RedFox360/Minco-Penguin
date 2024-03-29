import { CommandInteraction, MessageEmbed } from 'discord.js';
import { MessageActionRow, MessageButton } from 'discord.js';
import animalList from '../../json/animals.json';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import { hoursToMilliseconds } from 'date-fns';

const twoHours = hoursToMilliseconds(2);
const perGroup = Math.ceil(animalList.length / 3);
const animalSlices = new Array(3)
	.fill('')
	.map((_, i) =>
		animalList.slice(i * perGroup, (i + 1) * perGroup)
	);

const zoo = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('zoo')
			.setDescription('View your Minco Zoo!')
			.addStringOption(option =>
				option
					.setName('view_type')
					.setDescription('How to view the zoo')
					.setRequired(true)
					.addChoice('Compact', 'compact')
					.addChoice('List', 'list')
					.addChoice('Animal List', 'animal_list')
			)
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user whose zoo to view')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const animals = [];
		const viewType = interaction.options.getString('view_type');
		if (viewType === 'animal_list') {
			await viewAnimalList(interaction);
			return;
		}
		const userExists = interaction.options.getUser('user');
		const user = userExists ?? interaction.user;
		const { zoo } = await getProfile(user.id);
		if (!zoo.length) {
			if (userExists) {
				await interaction.reply({
					content: `${userExists} doesn't have any animals in their zoo`,
					allowedMentions: { users: [] }
				});
			} else {
				await interaction.reply(
					"You don't have any animals in your zoo!"
				);
			}
			return;
		}
		for (let i = 1; i <= zoo.length; i++) {
			if (viewType === 'list') {
				const { name, emoji } = zoo[i - 1];
				const end = i % 2 === 0 ? '\n' : ' ';
				const animal = `${emoji} ${name}${end}`;
				animals.push(animal);
			} else {
				const end = i % 5 === 0 ? '\n' : ' ';
				const animal = zoo[i - 1].emoji + end;
				animals.push(animal);
			}
		}
		const avatar = user
			? user.displayAvatarURL({ dynamic: true })
			: interaction.member.displayAvatarURL({
					dynamic: true
			  });
		const zooEmbed = new MessageEmbed()
			.setAuthor({ name: 'Minco Zoo', iconURL: avatar })
			.setColor('#F4D03F')
			.setDescription(animals.join(''))
			.setFooter({
				text:
					interaction.guild?.name ??
					interaction.user.username
			});

		await interaction.reply({ embeds: [zooEmbed] });
	});

async function viewAnimalList(
	interaction: CommandInteraction<'cached'>
) {
	const previous = new MessageButton()
		.setCustomId('prev')
		.setLabel('Previous')
		.setStyle('PRIMARY')
		.setEmoji('⬅️')
		.setDisabled();
	const next = new MessageButton()
		.setCustomId('next')
		.setLabel('Next')
		.setEmoji('➡️')
		.setStyle('PRIMARY');
	let currentPage = 0;
	const msg = await interaction.reply({
		content: format(animalSlices[currentPage]),
		components: [
			new MessageActionRow().addComponents(previous, next)
		],
		fetchReply: true,
		ephemeral: true
	});

	const collector = msg.createMessageComponentCollector({
		time: twoHours,
		componentType: 'BUTTON'
	});

	collector.on('collect', async buttonInteraction => {
		if (buttonInteraction.customId === 'prev') {
			currentPage--;
			next.setDisabled(false);
			if (currentPage === 0) {
				previous.setDisabled();
			}
			await buttonInteraction.update({
				content: format(animalSlices[currentPage]),
				components: [
					new MessageActionRow().addComponents(
						previous,
						next
					)
				]
			});
		} else {
			currentPage++;
			previous.setDisabled(false);
			if (currentPage === 2) {
				next.setDisabled();
			}
			await buttonInteraction.update({
				content: format(animalSlices[currentPage]),
				components: [
					new MessageActionRow().addComponents(
						previous,
						next
					)
				]
			});
		}
	});
}

function format(animalArr) {
	return animalArr
		.map(value => `${value.emoji} ${value.name}`)
		.join('\n');
}

export default zoo;
