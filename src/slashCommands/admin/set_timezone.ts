import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import { MessageButton, MessageActionRow } from "discord.js";
import timezoneList from "../../json/timezones.json";

export const data = new SlashCommandBuilder()
	.setName("set_timezone")
	.setDescription("Admin only: Set the timezone of your server")
	.addStringOption((option) =>
		option
			.setName("timezone")
			.setDescription("The timezone of your server")
			.setRequired(true)
	);

export async function run({ interaction, updateServer }: CommandData) {
	if (!interaction.member.permissions.has("ADMINISTRATOR")) {
		await interaction.reply({
			content: "This command can only be used by admins",
			ephemeral: true,
		});
		return;
	}

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

	await updateServer({ timezone });
	await interaction.reply(`Server timezone updated to ${timezone}`);
}
