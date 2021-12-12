import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("divorce")
	.setDescription("Divorce your spouse...");

export const cooldown = "3h";

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	if (!profile.spouse) {
		await interaction.reply({
			content:
				"You aren't married! You can't divorce your spouse if they don't exist",
			ephemeral: true,
		});
		return;
	}

	await interaction.reply(
		`Are you sure you want to divorce <@${profile.spouse}>? Respond with "yes" to continue`
	);
	const filter = (msg) => msg.author.id === interaction.user.id;

	interaction.channel
		.awaitMessages({
			filter,
			max: 1,
			time: 120_000,
			errors: ["time"],
		})
		.then(async (messages) => {
			const message = messages.first();
			if (message.content.toLowerCase() === "yes") {
				await updateProfile({ spouse: undefined }, profile.spouse);
				await updateProfile({ spouse: undefined });
				await interaction.followUp(
					`:broken_heart: You divorced <@${profile.spouse}>`
				);
			} else {
				await interaction.followUp("Divorce canceled");
			}
		})
		.catch(() => {
			interaction.followUp("Timed out!");
		});
}
