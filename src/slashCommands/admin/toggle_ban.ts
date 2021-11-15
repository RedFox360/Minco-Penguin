import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("toggle_ban")
	.setDescription("[Admin only] Ban a user from doing something")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("commands")
			.setDescription(
				"Ban a user from using Minco Penguin commands in the server"
			)
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user to ban")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("confessions")
			.setDescription(
				"Ban a user from using Minco Penguin confessions in the server"
			)
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user to ban")
					.setRequired(true)
			)
	);

export const permissions = ["MANAGE_GUILD"];

export async function run({
	interaction,
	profileInServerOf,
	updateProfileInServer,
}: CommandData) {
	const user = interaction.options.getUser("user");
	const userProfile = await profileInServerOf(user.id);
	if (user.id === interaction.user.id) {
		await interaction.reply({
			content: "You can't ban yourself!",
			ephemeral: true,
		});
		return;
	}
	switch (interaction.options.getSubcommand()) {
		case "commands": {
			const nowIsBanned = !userProfile.bannedFromCommands;
			await updateProfileInServer({ bannedFromCommands: nowIsBanned }, user.id);
			if (nowIsBanned) {
				await interaction.reply(
					`You banned ${user.toString()} from Minco Penguin`
				);
			} else {
				await interaction.reply(
					`You unbanned ${user.toString()} from Minco Penguin`
				);
			}
			break;
		}
		case "confessions": {
			const nowIsBanned = !userProfile.bannedFromConfessions;
			await updateProfileInServer(
				{ bannedFromConfessions: nowIsBanned },
				user.id
			);
			if (nowIsBanned) {
				await interaction.reply(
					`You banned ${user.toString()} from sending confessions`
				);
			} else {
				await interaction.reply(
					`You unbanned ${user.toString()} from sending confessions`
				);
			}
			break;
		}
	}
}
