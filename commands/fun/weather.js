const weather = require("weather-js");
const { Message, MessageEmbed } = require("discord.js");
module.exports = {
	description: "Check the weather!",
	usage: "!weather <city>",
	/** @param {Message} message */
	execute(message, args) {
		if (!args[0]) return message.channel.send("Enter the name of a city");
		weather.find(
			{
				search: args.join(" "),
				degreeType: "F",
			},
			(error, result) => {
				if (error) {
					message.channel.send("An error occured");
					return console.error(error);
				}
				if (result === undefined || result.length == 0) return message.channel.send("Specify a valid place.");

				let current = result[0].current;
				let location = result[0].location;

				const embed = new MessageEmbed()
					.setTitle(`Weather Info of ${location.name}`)
					.setDescription(current.skytext)
					.setThumbnail(current.imageurl)
					.setColor("#A6D4FF")
					.setTimestamp()
					.addFields(
						{
							name: "Temperature",
							value: current.temperature + "°F",
							inline: true,
						},
						{
							name: "Feels Like",
							value: current.feelslike + "°F",
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
