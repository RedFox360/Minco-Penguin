import { Collection, MessageEmbed } from "discord.js";
import { Interaction } from "../types";
import profileInServerModel from "../models/profileInServerSchema";
import profileModel from "../models/profileSchema";
import serverModel from "../models/serverSchema";
import ms from "ms";
import prettyMs from "pretty-ms";
import validPermissions from "../json/permissions.json";
const cooldowns = new Map();
export default async (interaction: Interaction) => {
	if (!interaction.isCommand()) return;
	const updateProfile = async (data: any, uid?: string) => {
		const filter = { userID: uid ?? interaction.user.id };
		const model =
			(await profileModel.findOneAndUpdate(filter, data, {
				new: true,
			})) ??
			(await profileModel.create({
				...filter,
				serverID: interaction.guild.id,
				mincoDollars: 100,
				bank: 0,
			}));
		return model;
	};
	const updateServer = async (data: any, sid?: string) => {
		const filter = { serverID: sid ?? interaction.guild.id };
		const model = await serverModel.findOneAndUpdate(filter, data, {
			new: true,
		});
		return model;
	};
	const updateProfileInServer = async (
		data: any,
		uid?: string,
		sid?: string
	) => {
		const filter = {
			userID: uid ?? interaction.user.id,
			serverID: sid ?? interaction.guild.id,
		};
		const model =
			(await profileInServerModel.findOneAndUpdate(filter, data, {
				new: true,
			})) ??
			(await profileModel.create({
				...filter,
				mincoDollars: 100,
				bank: 0,
			}));
		return model;
	};
	const profileOf = async (userID: string) => {
		const model =
			(await profileModel.findOne({ userID })) ??
			(await profileModel.create({
				userID,
				serverID: interaction.guild.id,
				mincoDollars: 100,
				bank: 0,
			}));
		return model;
	};
	const profileInServerOf = async (userID: string, serverID?: string) => {
		const sid = serverID ?? interaction.guild.id;
		const model =
			(await profileInServerModel.findOne({ userID, serverID: sid })) ??
			(await profileInServerModel.create({
				userID,
				serverID: sid,
				mincoDollars: 100,
				market: [],
				bank: 0,
			}));
		return model;
	};
	let profile = await profileOf(interaction.user.id);
	let profileInServer = await profileInServerOf(interaction.user.id);
	const server = await serverModel.findOne({
		serverID: interaction.guild.id,
	});
	const data = {
		interaction,
		profile,
		profileInServer,
		server,
		updateServer,
		updateProfile,
		updateProfileInServer,
		profileOf,
		profileInServerOf,
	};
	const command = (interaction.client as any).commands.get(
		interaction.commandName
	);

	if (command.permissions) {
		const permission = await handlePermissions(interaction, command);
		if (permission) return;
	}
	const cooldown = await handleCooldowns(interaction, command);
	if (cooldown) return;

	try {
		await command.run(data);
	} catch (err) {
		console.error(err);
		if (interaction.user.id === "724786310711214118") {
			const errorEmbed = new MessageEmbed()
				.setTitle("<:x_circle:872594799553839114>  **ERROR** ")
				.setDescription("```xl\n" + clean(err) + "\n```")
				.setColor("#E48383");
			await interaction.reply({
				embeds: [errorEmbed],
				ephemeral: true,
			});
		} else {
			await interaction.reply({ content: "An error occured", ephemeral: true });
		}
	}
};

async function handleCooldowns(interaction: Interaction, command: any) {
	if (!cooldowns.has(command.data.name))
		cooldowns.set(command.data.name, new Collection());
	const currentTime = Date.now();
	const timeStamps = cooldowns.get(command.data.name);
	const cooldown = command.cooldown ?? 1.5;
	const cooldownAmount =
		typeof cooldown === "string" ? ms(cooldown) : cooldown * 1000;
	if (timeStamps.has(interaction.user.id)) {
		const expTime = timeStamps.get(interaction.user.id) + cooldownAmount;
		if (currentTime < expTime) {
			const timeLeft = expTime - currentTime;
			let timeEmbed = new MessageEmbed()
				.setColor("RED")
				.setTitle("Cooldown")
				.setDescription(
					`Please wait ${prettyMs(timeLeft)} before using command ${
						command.data.name
					}`
				);
			await interaction.reply({ embeds: [timeEmbed], ephemeral: true });
			return true;
		}
	}
	timeStamps.set(interaction.user.id, currentTime);
}
async function handlePermissions(interaction: Interaction, command: any) {
	let invalidPerms = [];
	let botInvalidPerms = [];
	for (const perm of command.permissions) {
		if (!validPermissions.includes(perm)) {
			return console.log(`Invalid Permissions ${perm}`);
		}
		if (!interaction.member.permissions.has(perm)) {
			invalidPerms.push(perm);
		} else if (!interaction.guild.me.permissions.has(perm)) {
			botInvalidPerms.push(perm);
		}
	}
	if (invalidPerms.length) {
		await interaction.reply({
			content: `You need these permissions to run this command: \`${invalidPerms}\``,
			ephemeral: true,
		});
		return true;
	}
	if (botInvalidPerms.length) {
		await interaction.reply({
			content: `The bot needs these permissions to run this command: \`${botInvalidPerms}\``,
			ephemeral: true,
		});
		return true;
	}
	return false;
}
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
