import { MessageEmbed } from 'discord.js';
import { format } from 'date-fns';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const birthday = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('birthday')
			.setDescription("View someone's birthday")
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user whose birthday to view')
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const member = interaction.options.getMember('user');
		const { birthday } = await getProfile(member.id);
		if (!birthday) {
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setDescription(
							"<:x_circle:872594799553839114> This user's birthday hasn't been added to the database yet."
						)
						.setColor('#E48383')
				]
			});
			return;
		}
		const date = new Date(birthday);
		const formatted = format(
			date,
			getDateFormat(
				interaction.locale,
				date.getFullYear() === 2001
			)
		);
		const avatar = member.user.displayAvatarURL({
			dynamic: true
		});
		const embed = new MessageEmbed()
			.setAuthor({
				name: member.displayName,
				iconURL: avatar
			})
			.setDescription('🎂 ' + formatted)
			.setColor('#ffc0cb');
		await interaction.reply({ embeds: [embed] });
	});

function getDateFormat(locale: string, hasYear: boolean) {
	if (locale === 'en-US') {
		return hasYear ? 'MMM d' : 'MMM d, y';
	} else {
		return hasYear ? 'd MMM' : 'd MMM y';
	}
}

export default birthday;
