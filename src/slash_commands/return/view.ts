import { EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
const validImageSizes = [
	'16',
	'32',
	'56',
	'64',
	'96',
	'128',
	'256',
	'300',
	'512',
	'600',
	'1024',
	'2048',
	'4096'
];
const banner = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('view')
			.setDescription("View your/someone else's avatar or banner")
			.addSubcommand(subcommand =>
				subcommand
					.setName('banner')
					.setDescription("View your/someone else's banner")
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to view the banner of')
							.setRequired(true)
					)
					.addStringOption(option =>
						option
							.setName('size')
							.setDescription('The banner size (default = 1024)')
							.addChoices(
								...validImageSizes.map(i => ({ name: i, value: i }))
							)
							.setRequired(false)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('avatar')
					.setDescription("View your/someone else's avatar")
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to view the avatar of')
							.setRequired(true)
					)
					.addStringOption(option =>
						option
							.setName('size')
							.setDescription('The avatar size (default = 1024)')
							.addChoices(
								...validImageSizes.map(i => ({ name: i, value: i }))
							)
							.setRequired(false)
					)
			)
	)
	.setRun(async interaction => {
		const user = await interaction.options.getUser('user').fetch();
		const sizeOption = interaction.options.getString('size');
		const size = sizeOption ? parseInt(sizeOption) : 1024;
		if (interaction.options.getSubcommand() === 'banner') {
			if (!user.banner) {
				await interaction.reply(`${user} doesn't have a banner!`);
				return;
			}
			const banner = user.bannerURL({
				size: size as any
			});
			const embed = new EmbedBuilder()
				.setColor(user.accentColor)
				.setTitle('Banner')
				.setDescription(
					`[${user.username}'s banner image link](${banner})`
				)
				.setImage(banner)
				.setFooter({ text: user.tag })
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		} else {
			if (!user.avatar) {
				await interaction.reply(`${user} doesn't have an avatar!`);
				return;
			}
			const avatar = user.displayAvatarURL({
				size: size as any
			});
			const embed = new EmbedBuilder()
				.setColor(user.accentColor)
				.setTitle('Avatar')
				.setDescription(
					`[${user.username}'s avatar image link](${avatar})`
				)
				.setImage(avatar)
				.setFooter({ text: user.tag })
				.setTimestamp();
			await interaction.reply({ embeds: [embed] });
		}
	});

export default banner;
