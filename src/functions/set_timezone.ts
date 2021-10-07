import { CommandData } from "../types";
import { MessageButton, MessageActionRow } from "discord.js";
import timezoneList from "../json/timezones.json";

export default async function run({
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
