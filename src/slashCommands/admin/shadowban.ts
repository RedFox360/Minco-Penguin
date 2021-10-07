import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("shadowban")
	.setDescription("Shadow ban a user (deletes their messages)")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to shadow ban")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("set")
			.setDescription("On/off")
			.addChoice("On", "on")
			.addChoice("Off", "off")
			.setRequired(true)
	);

export const permissions = ["ADMINISTRATOR"];
export const serverOnly = true;
export async function run({
	interaction,
	profileInServerOf,
	updateProfileInServer,
}: CommandData) {
	const user = interaction.options.getUser("user");
	const set = interaction.options.getString("set") === "on";
	await updateProfileInServer({ isShadowBanned: set }, user.id);

	await interaction.reply("Shadow banned that user");
}
