import { find as findWeatherCallback } from 'weather-js';
import {
  MessageButton,
  MessageActionRow,
  MessageEmbed,
  MessageComponentInteraction,
  CommandInteraction
} from 'discord.js';
import { SlashCommand } from '../../types';
import { hoursToMilliseconds } from 'date-fns';
import { promisify } from 'util';
const findWeather = promisify(findWeatherCallback);

const collectorTime = hoursToMilliseconds(2);
const weather = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('weather')
      .setDescription('Get the weather from a location (from MSN)')
      .addStringOption(option =>
        option
          .setName('location')
          .setDescription(
            'The location to obtain the weather forecast from'
          )
          .setRequired(true)
      )
      .addStringOption(option =>
        option
          .setName('degree_type')
          .setDescription('The degree type for the weather forecast')
          .setRequired(false)
          .addChoice('Celsius', 'C')
          .addChoice('Fahrenheit', 'F')
      )
  )
  .setRun(run);

async function run(
  interaction:
    | CommandInteraction<'cached'>
    | MessageComponentInteraction<'cached'>,
  isEphemeral?: boolean,
  search?: string,
  degreeType?: string
) {
  const ephemeral = isEphemeral ?? false;
  const weatherButton = new MessageButton()
    .setCustomId('view_weather')
    .setLabel('Weather')
    .setStyle('PRIMARY')
    .setEmoji('☀️')
    .setDisabled();
  const forecastButton = new MessageButton()
    .setCustomId('view_forecast')
    .setLabel('Forecast')
    .setEmoji('🗓')
    .setStyle('PRIMARY');
  if (interaction.isCommand()) {
    search = interaction.options.getString('location');
    const degreeOption = interaction.options.getString('degree_type');
    degreeType = degreeOption
      ? degreeOption
      : interaction.locale === 'en-US'
      ? 'F'
      : 'C';
  }
  const result = await findWeather({
    search,
    degreeType
  });

  if (result === undefined || result.length === 0) {
    await interaction.reply({
      content: "That place doesn't exist!",
      ephemeral: true
    });
    return;
  }
  const { current, location } = result[0];
  const forecast = result[0].forecast[1];
  const fullForecast = result[0].forecast;
  fullForecast.shift();
  fullForecast.shift();
  const footer = {
    text: `Time Zone: UTC${location.timezone} | Observation time: ${current.date} ${current.observationtime}`
  };
  const color = '#A6D4FF';
  const firstEmbed = new MessageEmbed()
    .setTitle(`Weather: ${location.name}`)
    .setDescription(`${current.day}`)
    .setThumbnail(current.imageUrl)
    .setColor(color as any)
    .setTimestamp()
    .setFields(
      {
        name: 'Unit Type',
        value: degreeType === 'C' ? 'Metric' : 'Imperial/Customary',
        inline: true
      },
      {
        name: 'Temperature',
        value: `${current.temperature}°${degreeType}`,
        inline: true
      },
      {
        name: 'Sky',
        value: current.skytext,
        inline: true
      },
      {
        name: 'High',
        value: `${forecast.high}°${degreeType}`,
        inline: true
      },
      {
        name: 'Low',
        value: `${forecast.low}°${degreeType}`,
        inline: true
      },
      {
        name: 'Feels Like',
        value: `${current.feelslike}°${degreeType}`,
        inline: true
      },
      {
        name: 'Precipitation',
        value: forecast.precip + '%',
        inline: true
      },
      {
        name: 'Wind Speed',
        value: current.winddisplay,
        inline: true
      },
      {
        name: 'Humidity',
        value: current.humidity + '%',
        inline: true
      }
    )
    .setFooter(footer);

  const forecastEmbed = new MessageEmbed()
    .setTitle(`Forecast: ${location.name}`)
    .setColor(color as any)
    .setFooter(footer)
    .setThumbnail(current.imageUrl);

  for (const dailyForecast of fullForecast) {
    let description = `*Sky (Day)*: ${dailyForecast.skytextday}
*High*: ${dailyForecast.high}°${degreeType}
*Low*: ${dailyForecast.low}°${degreeType}`;

    if (dailyForecast.precip !== '' && dailyForecast.precip !== '0') {
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
    components: [
      new MessageActionRow().addComponents(
        weatherButton,
        forecastButton
      )
    ],
    fetchReply: true,
    ephemeral
  });

  const collector = msg.createMessageComponentCollector({
    filter: i =>
      i.customId === 'view_weather' || i.customId === 'view_forecast',
    time: collectorTime,
    componentType: 'BUTTON'
  });
  collector.on('collect', async buttonInteraction => {
    if (buttonInteraction.user.id !== interaction.user.id) {
      await run(buttonInteraction, true, search, degreeType);
      return;
    }
    if (buttonInteraction.customId === 'view_weather') {
      weatherButton.setDisabled(true);
      forecastButton.setDisabled(false);
      firstEmbed.setTimestamp();
      buttonInteraction.update({
        embeds: [firstEmbed],
        components: [
          new MessageActionRow().addComponents(
            weatherButton,
            forecastButton
          )
        ]
      });
    } else {
      weatherButton.setDisabled(false);
      forecastButton.setDisabled(true);
      forecastEmbed.setTimestamp();
      buttonInteraction.update({
        embeds: [forecastEmbed],
        components: [
          new MessageActionRow().addComponents(
            weatherButton,
            forecastButton
          )
        ]
      });
    }
  });
}
export default weather;
