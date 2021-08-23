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
	)
	.addRoleOption((option) =>
		option.setName("role").setDescription("The role to set").setRequired(true)
	);

export async function run({ interaction, updateServer }: CommandData) {
	const role = interaction.options.getRole("role");
	const type = interaction.options.getString("role_type");
	const typeFormat = type.charAt(0).toUpperCase() + type.slice(1);
	if (type == "main") {
		await updateServer({ muteRole: role.id });
	} else if (type == "mod") {
		await updateServer({ modRole: role.id });
	} else if (type == "bot") {
		await updateServer({ botRole: role.id });
	} else if (type == "mute") {
		await updateServer({ muteRole: role.id });
	}
	await interaction.reply(`${typeFormat} role set to ${role.toString()}`);
}
