import { CommandData } from "../types";

export default async function run({ interaction, updateServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.member.permissions.has("MANAGE_GUILD")) {
		await interaction.reply({
			content:
				"You need the `Manage Server` permission to execute this command",
			ephemeral: true,
		});
		return;
	}
	const value = interaction.options.getBoolean("value");
	switch (interaction.options.getString("option")) {
		case "sb": {
			await updateServer({ sendBirthdays: value });
			await interaction.reply(`Send birthdays has been set to ${value}`);
			break;
		}
		case "p": {
			await updateServer({ clean: !value });
			await interaction.reply(`Profanity allowed set to ${value}`);
			break;
		}
		case "sbm": {
			await updateServer({ silenceBans: value });
			await interaction.reply(`Silence bans set to ${value}`);
			break;
		}
		case "sjm": {
			await updateServer({ silenceJoins: value });
			await interaction.reply(`Silence joins set to ${value}`);
			break;
		}
	}
}
