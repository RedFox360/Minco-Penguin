import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("set_bool")
	.setDescription("Admin only: sets a boolean value for your server")
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
export const permissions = ["ADMINISTRATOR"];

export async function run({ interaction, updateServer }: CommandData) {
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
