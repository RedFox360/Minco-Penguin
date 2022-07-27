import memberInfo from '../../functions/info/member_info';
import serverInfo from '../../functions/info/server_info';
import channelInfo from '../../functions/info/channel_info';
import { SlashCommand } from '../../types';

const info = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('info')
			.setDescription('Get the info of a user')
			.addSubcommand(subcommand =>
				subcommand
					.setName('member')
					.setDescription('View the info of a member in the server')
					.addUserOption(option =>
						option
							.setName('user')
							.setDescription('The user to get info from')
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('channel')
					.setDescription('View the info of a channel in this server')
					.addChannelOption(option =>
						option
							.setName('channel')
							.setDescription('The channel to get info from')
							.setRequired(true)
					)
			)
			.addSubcommand(subcommand =>
				subcommand
					.setName('server')
					.setDescription('View the info of this server')
			)
	)
	.setRun(async interaction => {
		switch (interaction.options.getSubcommand()) {
			case 'member': {
				await memberInfo(
					interaction,
					interaction.options.getMember('user')
				);
				return;
			}
			case 'channel': {
				await channelInfo(interaction);
				return;
			}
			case 'server': {
				await serverInfo(interaction);
				return;
			}
		}
	});

export default info;
