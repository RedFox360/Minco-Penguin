import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
export const data = new SlashCommandBuilder()
	.setName("set_birthday")
	.setDescription("Set your birthday")
	.addStringOption((option) =>
		option
			.setName("birthday")
			.setDescription("Your birthday in the format (YYYY)-MM-DD")
			.setRequired(true)
	);

export async function run({ interaction, updateProfile }: CommandData) {
	const birthday = interaction.options.getString("birthday");
	const date = dayjs(birthday);
	if (!date.isValid()) {
		await interaction.reply({
			content: "That is an invalid date",
			ephemeral: true,
		});
		return;
	}
	await updateProfile({ birthday });
	await interaction.reply(
		`Your birthday has been set to ${date.format("MMM D")}`
	);
}
