const weather = require("weather-js");
const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Check the weather!",
	usage: "!weather <city>",
	/** @param {Message} message */
	execute(message, args) {
		let search = args.join(" ");
		if (!args[0]) search = "san diego";
		weather.find(
			{
				search,
				degreeType: "F",
			},
			(error, result) => {
				if (error) {
					message.channel.send("An error occured");
					return console.error(error);
				}
				if (result === undefined || result.length == 0) return message.channel.send("Specify a valid place.");

				const { current, location } = result[0];
				const forecast = result[0].forecast[1];
				const embed = new MessageEmbed()
					.setTitle(`Weather Info of ${location.name}`)
					.setDescription(current.skytext)
					.setThumbnail(location.imagerelativeurl)
					.setColor("#A6D4FF")
					.setTimestamp()
					.addFields(
						{
							name: "Temperature",
							value: current.temperature + "°F",
							inline: true,
						},
						{
							name: "High",
							value: forecast.high,
							inline: true,
						},
						{
							name: "Low",
							value: forecast.low,
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
					.setFooter(`Time Zone: UTC${location.timezone} | Observation time: ${current.date} ${current.observationtime}`);
				message.channel.send(embed);
			}
		);
	},
};
