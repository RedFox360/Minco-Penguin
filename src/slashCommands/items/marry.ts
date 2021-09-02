import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("marry")
	.setDescription("Marry someone")
	.addUserOption((option) =>
		option.setName("user").setDescription("The user to marry").setRequired(true)
	);

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	if (profile.spouse) {
		await interaction.reply({
			content: "You are already married!",
			ephemeral: true,
		});
		return;
	}
	await interaction.reply({ content: "Command not finished", ephemeral: true });
}
