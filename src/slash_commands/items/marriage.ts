import { EmbedBuilder } from 'discord.js';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const marriage = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('marriage')
			.setDescription('View a marriage status')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user whose marriage to view')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const userOption = interaction.options.getUser('user');
		const user = userOption ?? interaction.user;
		const { spouse } = await getProfile(user.id);
		const are = userOption ? `${user} is` : 'You are';
		if (!spouse) {
			await interaction.reply({
				content: `${are} not married`,
				allowedMentions: { users: [] }
			});
			return;
		}
		let spouseFormat: string;
		try {
			spouseFormat = (
				await interaction.guild.members.fetch(spouse)
			).toString();
		} catch (err) {
			spouseFormat = `**${
				(await interaction.client.users.fetch(spouse)).username
			}**`;
		}
		const marriageEmbed = new EmbedBuilder()
			.setTitle(':ring: Marriage')
			.setDescription(`${are} currently married to ${spouseFormat}`)
			.setColor(0xbedfff);
		await interaction.reply({ embeds: [marriageEmbed] });
	});

export default marriage;
