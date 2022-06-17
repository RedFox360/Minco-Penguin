import { SlashCommandIntegerOption } from '@discordjs/builders';
import { MessageEmbed } from 'discord.js';
import { gcd, lcm } from 'mathjs';
import { SlashCommand } from '../../types';
import {
  isPrime,
  isSquare,
  isPerfect,
  collatz,
  chunkString,
  pi,
  e,
  tau,
  phi,
  root2
} from '../../functions/number_functions';

// perfect nums below 2^53

const numberOption = new SlashCommandIntegerOption()
  .setName('number')
  .setDescription('The number to check')
  .setMinValue(1)
  .setRequired(true);

const number = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('number')
      .setDescription('Number functions')
      .addSubcommand(subcommand =>
        subcommand
          .setName('prime')
          .setDescription('Checks if a number is prime')
          .addIntegerOption(numberOption)
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('square')
          .setDescription('Checks if a number is a perfect square')
          .addIntegerOption(numberOption)
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('perfect')
          .setDescription(
            "Checks if the sum of the number's factors excluding itself equal the number"
          )
          .addIntegerOption(numberOption)
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('constant')
          .setDescription(
            'Sends some irrational constants; e.g. pi, tau, root 2, etc.'
          )
          .addStringOption(option =>
            option
              .setName('name')
              .setDescription('The name of the constant')
              .addChoice('Pi π', 'pi')
              .addChoice('Tau τ', 'tau')
              .addChoice('Phi Φ', 'phi')
              .addChoice('Square Root of 2', 'root_2')
              .addChoice("e (Euler's number)", 'e')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('collatz')
          .setDescription('Checks the collatz conjecture on a number')
          .addIntegerOption(
            numberOption.setMaxValue(1_000_000_000_000)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('gcf')
          .setDescription('Find the GCF of 2 numbers')
          .addIntegerOption(option =>
            option
              .setName('number_1')
              .setDescription('The first number')
              .setMinValue(1)
              .setRequired(true)
          )
          .addIntegerOption(option =>
            option
              .setName('number_2')
              .setDescription('The second number')
              .setMinValue(1)
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('lcm')
          .setDescription('Find the LCM of 2 numbers')
          .addIntegerOption(option =>
            option
              .setName('number_1')
              .setDescription('The first number')
              .setMinValue(1)
              .setRequired(true)
          )
          .addIntegerOption(option =>
            option
              .setName('number_2')
              .setDescription('The second number')
              .setMinValue(1)
              .setRequired(true)
          )
      )
  )
  .setRun(async interaction => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'constant') {
      switch (interaction.options.getString('name')) {
        case 'pi': {
          await interaction.reply({ embeds: [pi] });
          return;
        }
        case 'tau': {
          await interaction.reply({ embeds: [tau] });
          return;
        }
        case 'phi': {
          await interaction.reply({ embeds: [phi] });
          return;
        }
        case 'root_2': {
          await interaction.reply({ embeds: [root2] });
          return;
        }
        case 'e': {
          await interaction.reply({ embeds: [e] });
          return;
        }
      }
    } else if (subcommand === 'gcf') {
      const num1 = interaction.options.getInteger('number_1');
      const num2 = interaction.options.getInteger('number_2');
      if (num1 < 1 || num2 < 1) {
        await interaction.reply({
          content: 'Please enter positive integers',
          ephemeral: true
        });
        return;
      }
      const gcfResult = gcd(num1, num2);
      await interaction.reply(
        `The GCF of ${num1.toLocaleString(
          interaction.locale
        )} and ${num2.toLocaleString(
          interaction.locale
        )} is **${gcfResult.toLocaleString(interaction.locale)}**`
      );
    } else if (subcommand === 'lcm') {
      const num1 = interaction.options.getInteger('number_1');
      const num2 = interaction.options.getInteger('number_2');
      const lcmResult = lcm(num1, num2);
      await interaction.reply(
        `The LCM of ${num1.toLocaleString(
          interaction.locale
        )} and ${num2.toLocaleString(
          interaction.locale
        )} is **${lcmResult.toLocaleString(interaction.locale)}**`
      );
    } else {
      const num = interaction.options.getInteger('number');
      await interaction.deferReply();
      switch (subcommand) {
        case 'prime': {
          await interaction.editReply(
            isPrime(num, interaction.locale)
          );
          return;
        }
        case 'square': {
          await interaction.editReply(
            isSquare(num, interaction.locale)
          );
          return;
        }
        case 'perfect': {
          await interaction.editReply(
            isPerfect(num, interaction.locale)
          );
          return;
        }
        case 'collatz': {
          const { sequence, content, color } = collatz(
            num,
            interaction.locale
          );
          const hailstoneEmbed = new MessageEmbed()
            .setColor(color as any)
            .setTitle(
              `Hailstone Sequence for ${num.toLocaleString(
                interaction.locale
              )}`
            )
            .addField('Reached 1', content);
          if (sequence.length < 1000)
            hailstoneEmbed.addField('Sequence', sequence);
          else {
            const sequenceChunks = chunkString(sequence, 1_000);
            hailstoneEmbed.addField(`Sequence`, sequenceChunks[0]);
            for (let i = 1; i < sequenceChunks.length; i++) {
              hailstoneEmbed.addField(
                `Sequence (cont.)`,
                sequenceChunks[i]
              );
            }
          }
          await interaction.editReply({
            embeds: [hailstoneEmbed]
          });
          return;
        }
      }
    }
  });

export default number;
