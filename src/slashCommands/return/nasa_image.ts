import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import axios, { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { MessageEmbed } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("nasa")
	.setDescription("Sends the NASA image of the day!")
	.addStringOption((option) =>
		option
			.setName("date")
			.setDescription("[YYYY-MM-DD] The date to get for the image")
			.setRequired(false)
	);

export async function run({ interaction }: CommandData) {
	const currentDate = dayjs();
	const currentYear = currentDate.year();
	const currentMonth = currentDate.month() + 1;
	const dateOption = interaction.options.getString("date");
	const dateObj = date(dateOption);
	if (dateObj && currentDate.isBefore(dateObj[3])) {
		await interaction.reply({
			content: "You can't send a date in the future!",
			ephemeral: true,
		});
		return;
	}
	if (
		dateObj &&
		!(
			dateObj &&
			dateObj[0] == currentYear &&
			(dateObj[1] == currentMonth || dateObj[1] == currentMonth - 1)
		)
	) {
		await interaction.reply({
			content: "That date is out of range!",
			ephemeral: true,
		});
		return;
	}

	const response = await getResponse(dateObj);
	const embed = new MessageEmbed()
		.setColor("#25112D")
		.setAuthor(
			"Nasa Image of the Day",
			interaction.member.displayAvatarURL({ dynamic: true })
		)
		.setTitle(response.title)
		.setImage(response.hdurl)
		.setDescription(response.explanation);
	await interaction.reply({ embeds: [embed] });
}

function date(dateOption: string) {
	if (!dateOption) return null;
	const dateObj = dayjs(dateOption);
	if (!dateObj.isValid()) return null;
	return [dateObj.year(), dateObj.month() + 1, dateObj.date(), dateObj];
}
async function getResponse(dateObj) {
	let response: AxiosResponse;
	if (!dateObj) {
		response = await axios.get(
			"https://api.nasa.gov/planetary/apod?api_key=" +
				process.env.NASA_API_TOKEN
		);
	} else {
		response = await axios.get(
			`https://api.nasa.gov/planetary/apod?date=${dateObj[0]}-${dateObj[1]}-${dateObj[2]}&api_key=${process.env.NASA_API_TOKEN}`
		);
	}
	return response.data;
}
