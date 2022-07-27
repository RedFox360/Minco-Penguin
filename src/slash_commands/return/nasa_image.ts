import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
	EmbedBuilder
} from 'discord.js';
import axios from 'axios';
import { SlashCommand } from '../../types';
import { minutesToMilliseconds } from 'date-fns';

const nasa = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('nasa')
			.setDescription('Sends the NASA image of the day!')
			.addStringOption(option =>
				option
					.setName('date')
					.setDescription(
						'[YYYY-MM-DD] The date to get for the image'
					)
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const dateOption = interaction.options.getString('date');

		let response: {
			title: string;
			explanation: string;
			media_type: string;
			hdurl: any;
			url: string;
			copyright: string;
		};
		try {
			response = await getResponse(dateOption);
		} catch (err) {
			await interaction.reply({
				content: 'ERROR:\n`' + clean(err.response.data.msg) + '`',
				ephemeral: true
			});
			return;
		}
		const embed = new EmbedBuilder()
			.setColor(0x25112d)
			.setAuthor({
				name: 'Nasa Image of the Day',
				iconURL: interaction.member.displayAvatarURL()
			})
			.setTitle(response.title);
		if (response.media_type === 'image')
			embed.setImage(response.hdurl ?? response.url);
		else embed.setURL(response.url);

		if (response.copyright)
			embed.setFooter({
				text: 'Copyright ' + response.copyright
			});
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setStyle(ButtonStyle.Primary)
				.setLabel('View Description')
				.setCustomId('view-description')
		);
		const msg = await interaction.reply({
			embeds: [embed],
			components: [row],
			fetchReply: true
		});

		const collector = msg.createMessageComponentCollector({
			time: minutesToMilliseconds(45),
			componentType: ComponentType.Button,
			filter: i => i.customId === 'view-description'
		});

		collector.on('collect', async buttonInteraction => {
			await buttonInteraction.reply({
				content: response.explanation,
				ephemeral: true
			});
		});
	});

async function getResponse(date: string) {
	return (
		date
			? await axios.get(
					`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${process.env.NASA_API_TOKEN}`
			  )
			: await axios.get(
					'https://api.nasa.gov/planetary/apod?api_key=' +
						process.env.NASA_API_TOKEN
			  )
	).data;
}
function clean(text: any) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

export default nasa;
