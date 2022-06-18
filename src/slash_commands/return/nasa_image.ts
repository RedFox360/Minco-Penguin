import axios from 'axios';
import { MessageEmbed } from 'discord.js';
import { SlashCommand } from '../../types';

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
		let response;
		try {
			response = await getResponse(dateOption);
		} catch (err) {
			await interaction.reply({
				content: 'ERROR:\n`' + clean(err.response.data.msg) + '`',
				ephemeral: true
			});
			return;
		}
		const embed = new MessageEmbed()
			.setColor('#25112D')
			.setAuthor({
				name: 'Nasa Image of the Day',
				iconURL: interaction.member.displayAvatarURL({
					dynamic: true
				})
			})
			.setTitle(response.title)
			.setDescription(response.explanation);
		if (response.media_type === 'image')
			embed.setImage(response.hdurl ?? response.url);
		else embed.setURL(response.url);

		if (response.copyright)
			embed.setFooter({
				text: 'Copyright ' + response.copyright
			});
		await interaction.reply({ embeds: [embed] });
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
