import {
	ButtonInteraction,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType
} from 'discord.js';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import * as blackjack from '../../functions/for_commands/blackjack_functions';

const blackjackCommand = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('blackjack')
			.setDescription('Play blackjack in the Minco casino!')
			.addIntegerOption(option =>
				option
					.setName('bet')
					.setDescription('The amount of MD you want to bet')
					.setMinValue(25)
					.setMaxValue(250)
					.setRequired(true)
			)
	)
	.setCooldown(10)
	.setRun(async interaction => {
		const deck = blackjack.createDeck();
		const originalBet = interaction.options.getInteger('bet');
		if (originalBet < 25 || originalBet > 250) {
			await interaction.reply({
				content: 'Please enter a bet between 25 and 250',
				ephemeral: true
			});
			return;
		}
		const bets = [originalBet];
		const profile = await getProfile(interaction.user.id);
		if (originalBet > profile.mincoDollars) {
			await interaction.reply({
				content: `You don't have ${originalBet} Minco Dollars`,
				ephemeral: true
			});
			return;
		}
		const playerHands =
			interaction.channel.id === '858335619478454302'
				? ([
						[
							{
								type: ':clubs:',
								display: '8',
								value: 8
							},
							{
								type: ':diamonds:',
								display: '8',
								value: 8
							}
						]
				  ] as blackjack.Card[][])
				: new Array([
						blackjack.removeRandom(deck),
						blackjack.removeRandom(deck)
				  ]);
		const dealer = [
			blackjack.removeRandom(deck),
			blackjack.removeRandom(deck)
		];
		const playerHasBlackjack = blackjack.isBlackjack(playerHands[0]);
		const dealerHasBlackjack = blackjack.isBlackjack(dealer);
		let blackjackOutcome: blackjack.Outcome[];
		if (playerHasBlackjack && dealerHasBlackjack) {
			blackjackOutcome = ['You drew'];
		} else if (playerHasBlackjack) {
			blackjackOutcome = ['You got a blackjack! (win)'];
		} else if (dealerHasBlackjack) {
			blackjackOutcome = ['Minco Penguin got a blackjack (loss)'];
		}
		const playerValues = [blackjack.getValue(playerHands[0], true)];
		if (blackjackOutcome) {
			await interaction.reply({
				embeds: [
					blackjack.getEmbed(
						bets,
						playerHands,
						dealer,
						playerValues,
						false,
						0,
						blackjack.getValue(dealer),
						blackjackOutcome,
						blackjack.calculateOutcomeData(blackjackOutcome, bets)
					)
				]
			});
			return;
		}
		const hitButton = new ButtonBuilder()
			.setLabel('Hit')
			.setCustomId('hit')
			.setStyle(ButtonStyle.Primary);
		const standButton = new ButtonBuilder()
			.setLabel('Stand')
			.setCustomId('stand')
			.setStyle(ButtonStyle.Success);
		const doubleDown = new ButtonBuilder()
			.setLabel('Double Down')
			.setCustomId('double_down')
			.setStyle(ButtonStyle.Secondary);
		const split = new ButtonBuilder()
			.setLabel('Split')
			.setCustomId('split')
			.setStyle(ButtonStyle.Secondary)
			.setDisabled(
				playerHands[0][0].display !== playerHands[0][1].display
			);
		const howToPlay = new ButtonBuilder()
			.setLabel('How to play')
			.setStyle(ButtonStyle.Link)
			.setURL('https://bicyclecards.com/how-to-play/blackjack/');
		const getComponents = () => [
			new ActionRowBuilder<ButtonBuilder>().addComponents(
				hitButton,
				standButton,
				doubleDown,
				split
			),
			new ActionRowBuilder<ButtonBuilder>().addComponents(howToPlay)
		];
		const msg = await interaction.reply({
			embeds: [
				blackjack.getEmbed(
					bets,
					playerHands,
					dealer,
					playerValues,
					true
				)
			],
			components: getComponents(),
			fetchReply: true
		});
		let currentHand = 0;
		const outcomes = new Array<blackjack.Outcome>();
		const collector = msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 600_000 // 10 mins
		});

		const pushOutcome = (dealerValue: number) => {
			if (playerValues[currentHand].value > 21) {
				outcomes.push('You busted (loss)');
			} else if (dealerValue > 21) {
				outcomes.push('Minco Penguin busted (win)');
			} else if (dealerValue < playerValues[currentHand].value) {
				outcomes.push('You won!');
			} else if (dealerValue === playerValues[currentHand].value) {
				outcomes.push('You drew');
			} else {
				outcomes.push('You lost');
			}
		};
		const stand = async (
			buttonInteraction: ButtonInteraction<'cached'>,
			standTwice = false
		) => {
			if (buttonInteraction.user.id !== interaction.user.id) {
				await buttonInteraction.reply({
					content:
						'These buttons are only for the author of the message',
					ephemeral: true
				});
				return;
			}
			let dealerValue = blackjack.getValue(dealer);
			if (currentHand === 0) {
				while (dealerValue.value < 17) {
					dealer.push(blackjack.removeRandom(deck));
					dealerValue = blackjack.getValue(dealer);
				}
			}
			pushOutcome(dealerValue.value);
			if (standTwice) {
				currentHand++;
				pushOutcome(dealerValue.value);
			}
			// on last hand in case player split
			if (currentHand + 1 === playerHands.length) {
				collector.stop();
				hitButton.setDisabled(true);
				standButton.setDisabled(true);
				doubleDown.setDisabled(true);
				split.setDisabled(true);

				const winningData = blackjack.calculateOutcomeData(
					outcomes,
					bets
				);
				await updateProfile(
					{
						$inc: {
							mincoDollars: winningData.amount
						}
					},
					interaction.user.id
				);
				await buttonInteraction.update({
					embeds: [
						blackjack.getEmbed(
							bets,
							playerHands,
							dealer,
							playerValues,
							false,
							currentHand,
							dealerValue,
							outcomes,
							winningData
						)
					],
					components: getComponents()
				});
			} else {
				currentHand++;
				doubleDown.setDisabled(false);
				split.setDisabled(
					playerHands[currentHand][0].display !==
						playerHands[currentHand][1].display
				);
				await buttonInteraction.update({
					embeds: [
						blackjack.getEmbed(
							bets,
							playerHands,
							dealer,
							playerValues,
							currentHand !== playerHands.length,
							currentHand,
							dealerValue
						)
					],
					components: getComponents()
				});
			}
		};

		collector.on('collect', async buttonInteraction => {
			switch (buttonInteraction.customId) {
				case 'hit': {
					playerHands[currentHand].push(blackjack.removeRandom(deck));
					playerValues[currentHand] = blackjack.getValue(
						playerHands[currentHand]
					);
					if (playerValues[currentHand].value > 21) {
						await stand(buttonInteraction);
						break;
					}
					await buttonInteraction.update({
						embeds: [
							blackjack.getEmbed(
								bets,
								playerHands,
								dealer,
								playerValues,
								true,
								currentHand
							)
						],
						components: getComponents()
					});
					break;
				}
				case 'stand': {
					await stand(buttonInteraction);
					break;
				}
				case 'double_down': {
					if (
						bets[currentHand] * 2 >
						(await getProfile(interaction.user.id)).mincoDollars
					) {
						await buttonInteraction.reply({
							content: `You don't have enough MD to double down`,
							ephemeral: true
						});
						return;
					}
					bets[currentHand] *= 2;
					playerHands[currentHand].push(blackjack.removeRandom(deck));
					playerValues[currentHand] = blackjack.getValue(
						playerHands[currentHand]
					);
					await stand(buttonInteraction);
					break;
				}
				case 'split': {
					if (
						bets[currentHand] * 2 >
						(await getProfile(interaction.user.id)).mincoDollars
					) {
						await buttonInteraction.reply({
							content: `You don't have enough MD to split`,
							ephemeral: true
						});
						return;
					}
					const splitAces = playerHands[0][0].value === 0;
					const originalHand = playerHands[currentHand];
					playerHands[currentHand] = [
						originalHand[0],
						blackjack.removeRandom(deck)
					];
					playerHands.push([
						originalHand[1],
						blackjack.removeRandom(deck)
					]) - 1;
					bets.push(bets[currentHand]);
					playerValues.push(
						blackjack.getValue(playerHands[playerHands.length - 1])
					);
					playerValues[currentHand] = blackjack.getValue(
						playerHands[currentHand]
					);
					if (
						playerHands[currentHand][0].display !==
						playerHands[currentHand][1].display
					)
						split.setDisabled(true);

					if (splitAces) {
						await stand(buttonInteraction, true);
						break;
					}
					await buttonInteraction.update({
						embeds: [
							blackjack.getEmbed(
								bets,
								playerHands,
								dealer,
								playerValues,
								true,
								currentHand
							)
						],
						components: getComponents()
					});
				}
			}
		});
		collector.on('end', async (_, reason) => {
			if (reason === 'time') {
				hitButton.setDisabled(true);
				standButton.setDisabled(true);
				doubleDown.setDisabled(true);
				split.setDisabled(true);

				await interaction.followUp({
					content: 'The game timed out!'
				});
				await interaction.editReply({
					embeds: [
						blackjack.getEmbed(
							bets,
							playerHands,
							dealer,
							playerValues,
							true,
							currentHand
						)
					],
					components: getComponents()
				});
			}
		});
	});

export default blackjackCommand;
