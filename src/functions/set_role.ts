import { CommandData } from "../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("role")
		.setDescription("Set a role for your server")
		.addStringOption((option) =>
			option
				.setName("role_type")
				.setDescription("The type of role to set")
				.setRequired(true)
				.addChoice("Bot", "bot")
				.addChoice("Join", "join")
				.addChoice("Mute", "mute")
				.addChoice("Main", "main")
				.addChoice("Moderator", "mod")
		)
		.addRoleOption((option) =>
			option.setName("role").setDescription("The role to set").setRequired(true)
		);
}

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
	switch (type) {
		case "bot": {
			await updateServer({ botRole: role.id });
			break;
		}
		case "join": {
			await updateServer({ joinRole: role.id });
			break;
		}
		case "mute": {
			await updateServer({ muteRole: role.id });
			break;
		}
		case "main": {
			await updateServer({ mainRole: role.id });
			break;
		}
		case "mod": {
			await updateServer({ modRole: role.id });
			break;
		}
	}
	await interaction.reply(`${typeFormat} role set to ${role.toString()}`);
}
