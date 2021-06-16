const ms = require("ms");
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
			async (error, result) => {
				if (error) {
					message.channel.send("An error occured");
					return console.error(error);
				}
				if (result === undefined || result.length == 0)
					return message.channel.send("That place doesn't exist!");
				const { current, location } = result[0];
				const forecast = result[0].forecast[1];
				const fullForecast = result[0].forecast;
				const footer = `Time Zone: UTC${location.timezone} | Observation time: ${current.date} ${current.observationtime}`;
				const color = "#A6D4FF";
				const firstEmbed = new MessageEmbed()
					.setTitle(`Weather: ${location.name}`)
					.setDescription(`${current.day} | ${current.skytext}`)
					.setThumbnail(current.imageUrl)
					.setColor(color)
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
					.setFooter(footer);

				const forecastEmbed = new MessageEmbed()
					.setTitle(`Forecast: ${location.name}`)
					.setColor(color)
					.setFooter(footer)
					.setThumbnail(current.imageUrl);

				for (const dailyForecast of fullForecast) {
					let description = `*High*: ${dailyForecast.high}°F\n*Low*: ${dailyForecast.low}°F`;

					if (dailyForecast.precip != "" && dailyForecast.precip != "0") {
						description += `\n*Precipitation*: ${dailyForecast.precip}%`;
					}
					forecastEmbed.addField(
						`${dailyForecast.shortday} : ${dailyForecast.skytextday}`,
						description,
						true
					);
				}

				const msg = await message.channel.send(firstEmbed);
				try {
					await msg.react("⬅️");
					await msg.react("➡️");
				} catch (err) {
					console.error(err);
				}

				const filter = (_, user) => user.id === message.author.id;
				const collector = msg.createReactionCollector(filter, { time: ms("4m") });
				collector.on("collect", async (reaction) => {
					if (reaction.emoji.name == "⬅️") {
						firstEmbed.setTimestamp();
						msg.edit(firstEmbed);
					} else if (reaction.emoji.name == "➡️") {
						forecastEmbed.setTimestamp();
						msg.edit(forecastEmbed);
					}
					const userReactions = msg.reactions.cache.filter((react) =>
						react.users.cache.has(message.author.id)
					);
					try {
						for (const reaction of userReactions.values()) {
							await reaction.users.remove(message.author.id);
						}
					} catch (error) {
						console.error("Failed to remove reactions.");
					}
				});
			}
		);
	},
};
