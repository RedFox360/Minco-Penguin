import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import { MessageButton, MessageActionRow } from "discord.js";
import timezoneList from "../../json/timezones.json";

export const data = new SlashCommandBuilder()
	.setName("set_timezone")
	.setDescription("Admin only: Set the timezone of your server")
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
		if (!interaction.member.permissions.has("MANAGE_GUILD")) {
			await interaction.reply(
				"You need the `Manage Server` permission to execute this command"
			);
			return;
		}
		await updateServer({ timezone });
	} else {
		await updateProfile({ timezone });
	}
	await interaction.reply(`Server timezone updated to ${timezone}`);
}
