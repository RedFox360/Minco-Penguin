import { MessageEmbed } from 'discord.js';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import gemNumberToName from '../../functions/gem_number_to_name';
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
		const userExists = interaction.options.getUser('user');
		const user = userExists ?? interaction.user;

		const profile = await getProfile(user.id);
		if (!profile.gems.length) {
			await interaction.reply({
				content: `${
					userExists ? `${user} doesn't` : "You don't"
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
		const avatar = user
			? user.displayAvatarURL({ dynamic: true })
			: interaction.member.displayAvatarURL({
					dynamic: true
			  });
		const gemEmbed = new MessageEmbed()
			.setAuthor({ name: 'Gems', iconURL: avatar })
			.setDescription(gems.join('\n'))
			.setColor('#F8C471')
			.setFooter({
				text:
					interaction.guild?.name ??
					interaction.user.username
			});

		await interaction.reply({ embeds: [gemEmbed] });
	});

export default gems;
