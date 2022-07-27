import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	InteractionType,
	PermissionResolvable,
	PermissionsBitField
} from 'discord.js';
import { PermissionFlagsBits } from 'discord.js';
import { Collection, Interaction, Client } from 'discord.js';
import prettyMs from 'pretty-ms';
import { getProfileInServer } from '../functions/models';
import { SlashCommand, UserContextMenu } from '../types';
const cooldowns = new Map();

export default (client: Client) =>
	client.on('interactionCreate', async (interaction: Interaction) => {
		if (
			interaction.type ===
			InteractionType.ApplicationCommandAutocomplete
		) {
			const command: SlashCommand = interaction.client[
				'commands'
			].get(interaction.commandName);
			await command.autocomplete(interaction);
		}
		const isCommand = interaction.isChatInputCommand();
		const isContextMenu = interaction.isUserContextMenuCommand();
		if (!isCommand && !isContextMenu) return;
		// if (interaction.user.id !== process.env.OWNER_ID) {
		// 	await interaction.reply({
		// 		content: 'Minco is in debugging mode',
		// 		ephemeral: true
		// 	});
		// 	return;
		// }
		if (!interaction.inCachedGuild()) {
			await interaction.reply({
				content:
					'Sorry, Minco Penguin can only be used in servers now!',
				ephemeral: true
			});
			return;
		}
		if (!interaction.guild.available) {
			try {
				await interaction.user.send(
					'Minco Penguin cannot talk in the server you just sent a command in due to an outage.'
				);
			} catch {
				console.log(
					`Server Outage in ${interaction.guildId}\nBot failed to DM the user`
				);
			}
			return;
		}
		const command: SlashCommand | UserContextMenu =
			interaction.client['commands'].get(interaction.commandName);
		const profileInServer = await getProfileInServer(
			interaction.user.id,
			interaction.guildId
		);
		if (
			profileInServer.bannedFromCommands &&
			!interaction.member.permissions.has(
				PermissionFlagsBits.ManageMessages
			) &&
			interaction.user.id !== process.env.OWNER_ID
		) {
			await interaction.reply({
				content: 'You were banned from commands by a server manager',
				ephemeral: true
			});
			return;
		}
		if (isCommand && command instanceof SlashCommand) {
			if (command.cooldown) {
				const cooldown = handleCooldowns(interaction, command);
				if (cooldown?.cooldown) {
					await interaction.reply({
						content: cooldown.content,
						ephemeral: true
					});
					return;
				}
			}
			if (command.botPermissions?.length > 0) {
				const botPermissions = handleBotPermissions(
					interaction,
					command.botPermissions
				);
				if (!botPermissions.success) {
					await interaction.reply({
						content: botPermissions.content,
						ephemeral: true
					});
					return;
				}
			}
		}

		(command as any).run(interaction).catch(async err => {
			if (err.code !== 10062) console.error(err);
			if (interaction.user.id === process.env.OWNER_ID) {
				const errorEmbed = new EmbedBuilder()
					.setTitle('<:x_circle:872594799553839114>  **ERROR** ')
					.setDescription('```xl\n' + clean(err) + '\n```')
					.setColor(0xe48383);
				interaction
					.reply({
						embeds: [errorEmbed],
						ephemeral: true
					})
					.catch(() => {
						console.error('Unknown interaction');
					});
			} else {
				interaction
					.reply({
						content: 'An error occured',
						ephemeral: true
					})
					.catch(() => {
						console.error('Unknown interaction');
					});
			}
		});
	});

function handleCooldowns(
	interaction: ChatInputCommandInteraction<'cached'>,
	command: SlashCommand
) {
	const {
		builder: { name },
		cooldown: cooldown
	} = command;
	if (!cooldowns.has(name)) cooldowns.set(name, new Collection());
	const currentTime = Date.now();
	const timeStamps = cooldowns.get(name);
	if (timeStamps.has(interaction.user.id)) {
		const expTime = timeStamps.get(interaction.user.id) + cooldown;
		if (currentTime < expTime) {
			const timeLeft = expTime - currentTime;
			return {
				content: `:clock: Please wait ${prettyMs(
					timeLeft
				)} before using command /${name}`,
				cooldown: true
			};
		}
	}
	timeStamps.set(interaction.user.id, currentTime);
	return { cooldown: false };
}

function handleBotPermissions(
	interaction: ChatInputCommandInteraction<'cached'>,
	botPermissions: PermissionResolvable[]
) {
	const { me } = interaction.guild.members;
	const missingPermissions = botPermissions.filter(
		permission => !me.permissions.has(permission)
	);
	if (missingPermissions.length > 0) {
		const formattedPermissions = new PermissionsBitField(
			missingPermissions
		)
			.toArray()
			.map(a => '`' + pascalCaseToWords(a) + '`')
			.join(', ');
		return {
			success: false,
			content: `Minco Penguin needs the following permissions to run this command: ${formattedPermissions}`
		};
	}
	return { success: true };
}

function clean(text: any) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

// add spaces between words in pascal case
// e.g. "ThisIsAPascalCase" -> "This Is A Pascal Case"
// retain capitals
function pascalCaseToWords(str: string) {
	return str.replace(/([A-Z])/g, ' $1').trim();
}
