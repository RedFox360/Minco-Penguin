import { CommandData } from "../../types";
import * as weather from "weather-js";
import { MessageButton, MessageActionRow, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("weather")
	.setDescription("Get the weather from a location (from MSN)")
	.addStringOption((option) =>
		option
			.setName("location")
			.setDescription("The location to obtain the weather forecast from")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("degree_type")
			.setDescription("The degree type for the weather forecast")
			.setRequired(true)
			.addChoice("Celsius", "C")
			.addChoice("Fahrenheit", "F")
	);

export async function run({ interaction }: CommandData) {
	const weatherButton = new MessageButton()
		.setCustomId("view_weather")
		.setLabel("Weather")
		.setStyle("PRIMARY")
		.setEmoji("☀️")
		.setDisabled();
	const forecastButton = new MessageButton()
		.setCustomId("view_forecast")
		.setLabel("Forecast")
		.setEmoji("🗓")
		.setStyle("PRIMARY");
	let row = new MessageActionRow().addComponents(weatherButton, forecastButton);
	let search = interaction.options.getString("location");
	if (search.length === 1) search = "San Diego";
	const degreeType = interaction.options.getString("degree_type");
	weather.find(
		{
			search,
			degreeType: degreeType,
		},
		async (error, result) => {
			if (error) {
				await interaction.reply({
					content: "An error occured",
					ephemeral: true,
				});
				return console.error(error);
			}
			if (result === undefined || result.length == 0) {
				await interaction.reply({
					content: "That place doesn't exist!",
					ephemeral: true,
				});
				return;
			}
			const { current, location } = result[0];
			const forecast = result[0].forecast[1];
			const fullForecast = result[0].forecast;
			const footer = `Time Zone: UTC${location.timezone} | Observation time: ${current.date} ${current.observationtime}`;
			const color = "#A6D4FF";
			const firstEmbed = new MessageEmbed()
				.setTitle(`Weather: ${location.name}`)
				.setDescription(`${current.day} | ${current.skytext}`)
				.setThumbnail(current.imageUrl)
				.setColor(color as any)
				.setTimestamp()
				.addFields(
					{
						name: "Temperature",
						value: `${current.temperature}°${degreeType}`,
						inline: true,
					},
					{
						name: "High",
						value: `${forecast.high}°${degreeType}`,
						inline: true,
					},
					{
						name: "Low",
						value: `${forecast.low}°${degreeType}`,
						inline: true,
					},
					{
						name: "Precipitation",
						value: forecast.precip + "%",
						inline: true,
					},
					{
						name: "Wind Speed",
						value: current.winddisplay,
						inline: true,
					},
					{
						name: "Humidity",
						value: current.humidity + "%",
						inline: true,
					}
				)
				.setFooter(footer);

			const forecastEmbed = new MessageEmbed()
				.setTitle(`Forecast: ${location.name}`)
				.setColor(color as any)
				.setFooter(footer)
				.setThumbnail(current.imageUrl);

			for (const dailyForecast of fullForecast) {
				let description = `*High*: ${dailyForecast.high}°${degreeType}\n*Low*: ${dailyForecast.low}°${degreeType}`;

				if (dailyForecast.precip != "" && dailyForecast.precip != "0") {
					description += `\n*Precipitation*: ${dailyForecast.precip}%`;
				}
				forecastEmbed.addField(
					`${dailyForecast.shortday} : ${dailyForecast.skytextday}`,
					description,
					true
				);
			}

			const msg = await interaction.reply({
				embeds: [firstEmbed],
				components: [row],
				fetchReply: true,
			});

			const filter = (i) =>
				(i.customId === "view_weather" || i.customId === "view_forecast") &&
				i.user.id === interaction.user.id;

			const collector = msg.createMessageComponentCollector({
				filter,
				time: 45000,
			});
			collector.on("collect", async (i) => {
				if (i.customId === "view_weather") {
					weatherButton.setDisabled(true);
					forecastButton.setDisabled(false);
					row = new MessageActionRow().addComponents(
						weatherButton,
						forecastButton
					);
					firstEmbed.setTimestamp();
					i.update({ embeds: [firstEmbed], components: [row] });
				} else {
					weatherButton.setDisabled(false);
					forecastButton.setDisabled(true);
					row = new MessageActionRow().addComponents(
						weatherButton,
						forecastButton
					);
					forecastEmbed.setTimestamp();
					i.update({ embeds: [forecastEmbed], components: [row] });
				}
			});
		}
	);
}
