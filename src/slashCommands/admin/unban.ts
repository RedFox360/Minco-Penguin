import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("unban")
	.setDescription("MOD: unban a user")
	.addStringOption((option) =>
		option
			.setName("user")
			.setDescription("The **ID** of the user you want to unban")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("Why you wanted to unban that user")
			.setRequired(false)
	);
export const permissions = ["BAN_MEMBERS"];
export async function run({ interaction }: CommandData) {
	const user = interaction.options.getString("user");
	const userObj = await interaction.client.users.fetch(user);
	if (!userObj) {
		await interaction.reply({
			content: "That user doesn't exist!",
			ephemeral: true,
		});
		return;
	}
	const reason = interaction.options.getString("reason");
	try {
		await interaction.guild.members.unban(user, reason);
	} catch (err) {
		await interaction.reply({
			content: "That user isn't banned!",
			ephemeral: true,
		});
	}
	await interaction.reply(`You unbanned ${userObj.tag}`);
	await userObj.send(`You were unbanned in ${interaction.guild.name}`);
}
