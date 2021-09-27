import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("role")
	.setDescription("Set roles for your server")
	.addStringOption((option) =>
		option
			.setName("role_type")
			.setDescription("The type of role to set")
			.setRequired(true)
			.addChoice("Main", "main")
			.addChoice("Mute", "mute")
			.addChoice("Moderator", "mod")
			.addChoice("Bot", "bot")
			.addChoice("Join", "join")
	)
	.addRoleOption((option) =>
		option.setName("role").setDescription("The role to set").setRequired(true)
	);

export async function run({ interaction, updateServer }: CommandData) {
	if (
		!interaction.member.permissions.has("MANAGE_ROLES") &&
		!interaction.member.permissions.has("MANAGE_GUILD")
	) {
		await interaction.reply({
			content: "This channel can only be used by server admins",
			ephemeral: true,
		});
		return;
	}
	const role = interaction.options.getRole("role");
	const type = interaction.options.getString("role_type");
	const typeFormat = type.charAt(0).toUpperCase() + type.slice(1);
	if (type == "main") {
		await updateServer({ mainRole: role.id });
	} else if (type == "mod") {
		await updateServer({ modRole: role.id });
	} else if (type == "bot") {
		await updateServer({ botRole: role.id });
	} else if (type == "mute") {
		await updateServer({ muteRole: role.id });
	} else if (type == "join") {
		await updateServer({ joinRole: role.id });
	}
	await interaction.reply(`${typeFormat} role set to ${role.toString()}`);
}
