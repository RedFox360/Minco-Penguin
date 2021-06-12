const weather = require("weather-js");
const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "Check the weather! (Checks San Diego if you don't provide a city argument)",
	usage: "!weather <city>",
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
				if (result === undefined || result.length == 0) return message.channel.send("That place doesn't exist!");
				const { current, location } = result[0];
				const forecast = result[0].forecast[1];
				const embed = new MessageEmbed()
					.setTitle(`Weather: ${location.name}`)
					.setDescription(`${current.day} | ${current.skytext}`)
					.setThumbnail(current.imageUrl)
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
							value: forecast.high + "°F",
							inline: true,
						},
						{
							name: "Low",
							value: forecast.low + "°F",
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
