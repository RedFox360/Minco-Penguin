import { CommandData } from "../types";
import dayjs from "dayjs";

export default async function run({ interaction, updateProfile }: CommandData) {
	const birthday = interaction.options.getString("birthday");
	const date = dayjs(birthday);
	const user = interaction.options.getUser("user");
	if (!date.isValid()) {
		await interaction.reply({
			content: "That is an invalid date",
			ephemeral: true,
		});
		return;
	}
	if (user) {
		if (
			!["724786310711214118", "804575179158192128"].includes(
				interaction.user.id
			)
		) {
			await interaction.reply({
				content: "You can't set the birthday of a user!",
				ephemeral: true,
			});
			return;
		}
		await updateProfile({ birthday }, user.id);
		await interaction.reply(
			`You updated ${user.toString()}'s birthday to ${date.format("MMMM DD")}`
		);
	} else {
		await updateProfile({ birthday });
		await interaction.reply(
			`Your birthday has been set to ${date.format("MMMM DD")}`
		);
	}
}
