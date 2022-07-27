import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import gemNumberToName from '../../functions/basics/gem_number_to_name';
import { EmbedBuilder } from 'discord.js';
const gems = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('gems')
			.setDescription('View your gems!')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to view the gems of')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const memberExists = interaction.options.getMember('user');
		const member = memberExists ?? interaction.member;

		const profile = await getProfile(member.id);
		if (!profile.gems.length) {
			await interaction.reply({
				content: `${
					memberExists ? `${member} doesn't` : "You don't"
				} have any gems`,
				allowedMentions: {
					users: []
				}
			});
			return;
		}

		const gems = profile.gems
			.map(gemNumberToName)
			.map((t, i) => `${i + 1}. ${t}`);
		const avatar = member.displayAvatarURL();
		const gemEmbed = new EmbedBuilder()
			.setAuthor({
				name: `${member.displayName}'s Gems`,
				iconURL: avatar
			})
			.setDescription(gems.join('\n'))
			.setColor(0xf8c471)
			.setFooter({
				text: interaction.guild?.name ?? interaction.user.username
			});

		await interaction.reply({ embeds: [gemEmbed] });
	});

export default gems;
