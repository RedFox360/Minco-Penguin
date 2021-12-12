import { CommandData } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("boolean")
		.setDescription("Sets a boolean (true/false) value for your server")
		.addStringOption((option) =>
			option
				.setName("option")
				.setDescription("The name of the option to set")
				.addChoice("Send Birthdays", "sb")
				.addChoice("Profanity", "p")
				.addChoice("Silence Ban Messages", "sbm")
				.addChoice("Silence Join Messages", "sjm")
				.setRequired(true)
		)
		.addBooleanOption((option) =>
			option
				.setName("value")
				.setDescription("The true/false value of the option")
				.setRequired(true)
		);
}

export async function run({ interaction, updateServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.member.permissions.has("MANAGE_GUILD")) {
		await interaction.reply({
			content:
				"You need the `Manage Server` permission to execute this command",
			ephemeral: true,
		});
		return;
	}
	const value = interaction.options.getBoolean("value");
	switch (interaction.options.getString("option")) {
		case "sb": {
			await updateServer({ sendBirthdays: value });
			await interaction.reply(`Send birthdays has been set to ${value}`);
			break;
		}
		case "p": {
			await updateServer({ clean: !value });
			await interaction.reply(`Profanity allowed set to ${value}`);
			break;
		}
		case "sbm": {
			await updateServer({ silenceBans: value });
			await interaction.reply(`Silence bans set to ${value}`);
			break;
		}
		case "sjm": {
			await updateServer({ silenceJoins: value });
			await interaction.reply(`Silence joins set to ${value}`);
			break;
		}
	}
}
