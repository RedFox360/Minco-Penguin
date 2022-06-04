import {
	Collection,
	Interaction,
	CommandInteraction,
	MessageEmbed,
	Permissions,
	ApplicationCommandOptionChoiceData
} from 'discord.js';
import prettyMs from 'pretty-ms';
import { getProfileInServer } from '../functions/models';
import { SlashCommand, UserContextMenu } from '../types';
import fishJSON from '../json/fish.json';
import animals from '../json/animals.json';
const fishAutocompleteData =
	new Array<ApplicationCommandOptionChoiceData>();
const animalAutocompleteData =
	new Array<ApplicationCommandOptionChoiceData>();
for (const [fishName, fishData] of Object.entries(fishJSON)) {
	fishAutocompleteData.push({
		name:
			fishData.formattedNames[0].charAt(0).toUpperCase() +
			fishData.formattedNames[0].slice(1),
		value: fishName
	});
}
for (const animal of animals) {
	animalAutocompleteData.push({
		name: animal.name,
		value: animal.name
	});
}

const autocompleteFilter = (
	givenAName: string,
	givenValue: string
) => {
	const aName = givenAName.toLowerCase();
	const value = givenValue.trim().toLowerCase();
	return (
		aName.startsWith(value) ||
		aName.includes(value) ||
		value.includes(aName)
	);
};

const cooldowns = new Map();
export default async (interaction: Interaction) => {
	if (interaction.isAutocomplete()) {
		// SELL FISH
		if (interaction.options.getSubcommand() === 'fish') {
			const value = interaction.options.getFocused().toString();
			const matchingFishes = fishAutocompleteData.filter(a =>
				autocompleteFilter(a.name, value)
			);
			await interaction.respond(matchingFishes.slice(0, 25));
			return;
		} else if (interaction.options.getSubcommand() === 'animal') {
			const value = interaction.options.getFocused().toString();
			const matchingAnimals = animalAutocompleteData.filter(a =>
				autocompleteFilter(a.name, value)
			);
			await interaction.respond(matchingAnimals.slice(0, 25));
			return;
		}
	}
	const isCommand = interaction.isCommand();
	const isContextMenu = interaction.isContextMenu();
	if (!isCommand && !isContextMenu) return;
	// if (interaction.user.id !== '724786310711214118') {
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
	const { commandName } = interaction;

	const command: SlashCommand | UserContextMenu =
		interaction.client['commands'].get(commandName);
	const profileInServer = await getProfileInServer(
		interaction.user.id,
		interaction.guildId
	);
	if (
		profileInServer.bannedFromCommands &&
		!interaction.member.permissions.has(
			Permissions.FLAGS.MANAGE_MESSAGES
		) &&
		interaction.user.id !== '724786310711214118'
	) {
		await interaction.reply({
			content:
				'You were banned from commands by a server manager',
			ephemeral: true
		});
		return;
	}
	if (isCommand && command instanceof SlashCommand) {
		if (command.permissions?.length) {
			const permission = handlePermissions(
				interaction,
				command
			);
			if (permission?.permsNeeded) {
				await interaction.reply({
					content: permission.content,
					ephemeral: true
				});
				return;
			}
		}
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
	}

	(command as any).run(interaction).catch(async err => {
		if (err.code !== 10062) console.error(err);
		if (interaction.user.id === '724786310711214118') {
			const errorEmbed = new MessageEmbed()
				.setTitle(
					'<:x_circle:872594799553839114>  **ERROR** '
				)
				.setDescription('```xl\n' + clean(err) + '\n```')
				.setColor('#E48383');
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
};

function handleCooldowns(
	interaction: CommandInteraction,
	command: SlashCommand
) {
	const {
		builder: { name },
		cooldown
	} = command;
	if (!cooldowns.has(name)) cooldowns.set(name, new Collection());
	const currentTime = Date.now();
	const timeStamps = cooldowns.get(name);
	if (timeStamps.has(interaction.user.id)) {
		const expTime =
			timeStamps.get(interaction.user.id) + cooldown;
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
function handlePermissions(
	interaction: CommandInteraction<'cached'>,
	command: SlashCommand
) {
	const invalidPerms = [];
	const botInvalidPerms = [];
	const permissions = command.permissions;
	if (command.permissionsRequiredForBot === false) {
		permissions.forEach(
			(perm: any) =>
				!interaction.member.permissions.has(perm) &&
				invalidPerms.push(
					formatPermission(
						new Permissions(perm).toArray()[0]
					)
				)
		);
	} else {
		permissions.forEach(perm => {
			const permString = formatPermission(
				new Permissions(perm).toArray()[0]
			);
			if (!interaction.member.permissions.has(perm)) {
				invalidPerms.push(permString);
			} else if (!interaction.guild.me.permissions.has(perm)) {
				botInvalidPerms.push(permString);
			}
		});
	}
	if (invalidPerms.length) {
		return {
			content: `You need these permissions to run this command: \`${invalidPerms.join(
				', '
			)}\``,
			permsNeeded: true
		};
	}
	if (botInvalidPerms.length) {
		return {
			content: `The bot needs these permissions to run this command: \`${botInvalidPerms.join(
				', '
			)}\``,
			permsNeeded: true
		};
	}
	return { permsNeeded: false };
}

function clean(text: any) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}

function formatPermission(perm: string) {
	const spaced = perm.replaceAll(/_/g, ' ');
	return capitalizeEachWordInString(spaced.toLowerCase());
}

function capitalizeEachWordInString(str: string) {
	return str.replace(
		/\w\S*/g,
		txt =>
			txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
	);
}
