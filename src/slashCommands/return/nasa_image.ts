import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import axios, { AxiosResponse } from "axios";
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
	const dateOption = interaction.options.getString("date");
	let response;
	try {
		response = await getResponse(dateOption);
	} catch (err) {
		await interaction.reply({
			content: "ERROR:\n`" + clean(err.response.data.msg) + "`",
			ephemeral: true,
		});
		return;
	}
	const embed = new MessageEmbed()
		.setColor("#25112D")
		.setAuthor(
			"Nasa Image of the Day",
			interaction.member.displayAvatarURL({ dynamic: true })
		)
		.setTitle(response.title)
		.setDescription(response.explanation);
	if (response.media_type === "image")
		embed.setImage(response.hdurl ?? response.url);
	if (response.copyright) embed.setFooter("Copyright " + response.copyright);
	const botResponse = { embeds: [embed] };
	if (response.media_type !== "image")
		botResponse["content"] = response.hdurl ?? response.url;
	await interaction.reply(botResponse);
}

async function getResponse(date) {
	let response: AxiosResponse;
	if (!date) {
		response = await axios.get(
			"https://api.nasa.gov/planetary/apod?api_key=" +
				process.env.NASA_API_TOKEN
		);
	} else {
		response = await axios.get(
			`https://api.nasa.gov/planetary/apod?date=${date}&api_key=${process.env.NASA_API_TOKEN}`
		);
	}
	return response.data;
}
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
