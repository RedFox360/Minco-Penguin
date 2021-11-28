import { CommandData } from "../types";
import { MessageButton, MessageActionRow } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import timezoneList from "../json/timezones.json";

export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("timezone")
		.setDescription("Set a timezone for your server/user")
		.addStringOption((option) =>
			option
				.setName("type")
				.setDescription("Personal or server timezone")
				.setRequired(true)
				.addChoice("Personal", "personal")
				.addChoice("Server", "server")
		)
		.addStringOption((option) =>
			option
				.setName("timezone")
				.setDescription("The timezone of your server")
				.setRequired(true)
		);
}

export async function run({
	interaction,
	updateProfile,
	updateServer,
}: CommandData) {
	const choice = interaction.options.getString("type");
	const timezone = interaction.options.getString("timezone");
	if (!timezoneList.includes(timezone)) {
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setLabel("Valid Timezones")
				.setEmoji("⏰")
				.setStyle("LINK")
				.setURL("https://pastebin.com/r7UfkZeQ")
		);
		await interaction.reply({
			content: "You entered an invalid timezone!",
			components: [row],
		});
		return;
	}
	if (choice == "server") {
		if (!interaction.guild) {
			await interaction.reply({
				content: "This command can only be used in a server",
			});
		}
		if (!interaction.member.permissions.has("MANAGE_GUILD")) {
			await interaction.reply({
				content:
					"You need the `Manage Server` permission to execute this command",
				ephemeral: true,
			});
			return;
		}
		await updateServer({ timezone });
		await interaction.reply(`Server timezone updated to ${timezone}`);
	} else {
		await updateProfile({ timezone });
		await interaction.reply(`Personal timezone updated to ${timezone}`);
	}
}
