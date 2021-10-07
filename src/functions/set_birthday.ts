import { CommandData } from "../types";
import dayjs from "dayjs";

export default async function run({ interaction, updateProfile }: CommandData) {
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
