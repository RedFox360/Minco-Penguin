import { format } from 'date-fns';
import {
	ChatInputCommandInteraction,
	SlashCommandSubcommandBuilder
} from 'discord.js';
import { updateProfile } from '../models';

export const subcommand = new SlashCommandSubcommandBuilder()
	.setName('birthday')
	.setDescription('Set your birthday')
	.addStringOption(option =>
		option
			.setName('birthday')
			.setDescription('Your birthday in the format (YYYY)-MM-DD')
			.setRequired(true)
	)
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription(
				'Owner only: set the birthday of a specific user'
			)
			.setRequired(false)
	);

export async function run(
	interaction: ChatInputCommandInteraction<'cached'>
) {
	const birthday = interaction.options.getString('birthday');
	const date = new Date(birthday);
	const user = interaction.options.getUser('user');
	if (isNaN(date.getTime())) {
		await interaction.reply({
			content: 'That is an invalid date',
			ephemeral: true
		});
		return;
	}
	const formattedDate = format(
		date,
		getDateFormat(interaction.locale)
	);
	if (user) {
		if (
			![process.env.OWNER_ID, '804575179158192128'].includes(
				interaction.user.id
			)
		) {
			await interaction.reply({
				content: "You can't set the birthday of a user!",
				ephemeral: true
			});
			return;
		}
		await updateProfile({ birthday }, user.id);
		await interaction.reply(
			`You updated ${user}'s birthday to ${formattedDate}`
		);
	} else {
		await updateProfile({ birthday }, interaction.user.id);
		await interaction.reply(
			`Your birthday has been set to ${formattedDate}`
		);
	}
}
function getDateFormat(locale: string) {
	if (locale === 'en-US') {
		return 'MMMM d';
	} else {
		return 'd MMMM';
	}
}
