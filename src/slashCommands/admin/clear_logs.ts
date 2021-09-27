import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("clear_logs")
	.setDescription("MOD: Clear the logs of a user")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to clear the logs of")
			.setRequired(true)
	);
export const permissions = ["MANAGE_MESSAGES", "KICK_MEMBERS"];
export async function run({ interaction, updateProfileInServer }: CommandData) {
	const user = interaction.options.getUser("user");
	await updateProfileInServer({ infractions: [] }, user.id);
	await interaction.reply("Logs cleared for " + user.toString());
}
