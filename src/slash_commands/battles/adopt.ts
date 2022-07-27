import {
	ComponentType,
	EmbedBuilder,
	ModalActionRowComponentBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from 'discord.js';
import { hoursToMilliseconds, minutesToMilliseconds } from 'date-fns';
import { ActionRowBuilder, SelectMenuBuilder } from 'discord.js';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';
import penguinData from '../../json/penguins_battle.json';

const collectorTime = hoursToMilliseconds(2);
const color = 0x537ed1;
const adopt = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('adopt')
			.setDescription('Adopt a Minco Penguin to start battling!')
	)
	.setCooldown(20 * 60)
	.setRun(async interaction => {
		const embeds = [
			new EmbedBuilder()
				.setColor(color)
				.setTitle('Adopt a penguin')
				.setDescription(
					`Use the select menu below to choose a penguin. Remember: once you choose a penguin, you can't change it without resetting your inventory, tokens, and progress!
				
\`Clan     |\`🔥\`|\`💨\`|\`❤️\`|\`🛡\`|\`♻️\`|\`💀\`|\`
\`warrior  | 30| 1.5| 100| 30| 10|  25|  5|\`
\`magician | 25| 1.5|  85| 50| 15|  30| 20|\`
\`medic    | 20|   1| 150| 30| 20|  20|  5|\`
\`ninja    | 70|   1|  85| 50|  5|  90| 50|\`
\`archer   | 25|   2|  85| 25| 10|  50| 10|\`

🔥 = Attack Power (HP)
💨 = Attack Speed (attacks/sec)
❤️ = Health (HP)
🛡 = Defense (% chance to take -30% damage)
♻️ = Regeneration Rate (HP/sec)
💀 = Crit Chance (% chance)`
				),
			new EmbedBuilder()
				.setColor(penguinData.warriorColor)
				.setTitle('⚔️ Warrior')
				.setDescription(
					'The warriors are a strong group of penguins who are able to defend their cities themselves with their powerful attacks. Although they are very powerful, they often resort to brute force which allows other more strategic penguins to defeat them.'
				),
			new EmbedBuilder()
				.setColor(penguinData.magicianColor)
				.setTitle('🔮 Magician')
				.setDescription(
					'The magicians are an elusive group of penguins that specialize in magic. They are able to use their powerful spells to do everything from creating light to killing enemies. However, they take a lot of time to cast spells and in their moments of weakness they are easily defeated by different penguins.'
				),
			new EmbedBuilder()
				.setColor(penguinData.medicColor)
				.setTitle('🏥 Medic')
				.setDescription(
					'Most penguins do not consider their healers as powerful members on the battlefield. However, the medic penguins specialize in healing. They can heal others and even themselves, and often use their healing abilities to protect themselves. During battles, many medics keep healing themselves until the other side gets tired. However, if another penguin can deal enough damage, a medic can be killed easily.'
				),
			new EmbedBuilder()
				.setColor(penguinData.ninjaColor)
				.setTitle('🗡 Ninja')
				.setDescription(
					'The ninjas hide in the battlefield, spying on their enemies and looking for their weaknesses. They are masters of strategy and only wait for the perfect time to attack. During a battle, a ninja can suddenly jump out and usually defeat their enemies with a single blow. Although their attacks are powerful, if they are spotted, then the battle is over for them.'
				),
			new EmbedBuilder()
				.setColor(penguinData.archerColor)
				.setTitle('🏹 Archer')
				.setDescription(
					'Archers attack from a safe distance, using their bows and arrows to defeat others. They are very quick at attacking and can quickly pierce their enemies. If they have a clear line of sight with their enemy and an open battlefield, archers usually win. With the wrong conditions, archers often fail, especially to penguins who can make them run out of arrows or attack them by surprise.'
				),
			new EmbedBuilder().setColor(0x5dade2).setImage(penguinData.all)
		];

		const row =
			new ActionRowBuilder<SelectMenuBuilder>().addComponents(
				new SelectMenuBuilder()
					.setCustomId('adopt-penguin')
					.setPlaceholder('Choose a penguin!')
					.addOptions(
						{
							label: 'Warrior',
							value: 'warrior',
							emoji: penguinData.warriorEmoji
						},
						{
							label: 'Magician',
							value: 'magician',
							emoji: penguinData.magicianEmoji
						},
						{
							label: 'Medic',
							value: 'medic',
							emoji: penguinData.medicEmoji
						},
						{
							label: 'Ninja',
							value: 'ninja',
							emoji: penguinData.ninjaEmoji
						},
						{
							label: 'Archer',
							value: 'archer',
							emoji: penguinData.archerEmoji
						}
					)
					.setMaxValues(1)
			);

		const msg = await interaction.reply({
			embeds,
			components: [row],
			fetchReply: true
		});

		const collector = msg.createMessageComponentCollector({
			componentType: ComponentType.SelectMenu,
			time: collectorTime
		});

		collector.on('collect', async selectMenuInteraction => {
			const profile = await getProfile(selectMenuInteraction.user.id);
			if (profile.battleSystem?.penguin) {
				await selectMenuInteraction.reply({
					content:
						"You've already adopted a penguin. If you want to use a new penguin, please reset your current one.",
					ephemeral: true
				});
				return;
			}
			const value = selectMenuInteraction.values[0];
			const modal = new ModalBuilder()
				.setCustomId('choose-penguin-name-modal')
				.setTitle('Choose a name for your penguin!')
				.addComponents(
					new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
						new TextInputBuilder()
							.setCustomId('name-input')
							.setLabel('Penguin name')
							.setStyle(TextInputStyle.Short)
							.setRequired(true)
					)
				);
			await selectMenuInteraction.showModal(modal);
			selectMenuInteraction
				.awaitModalSubmit({
					filter: a => a.customId === 'choose-penguin-name-modal',
					time: minutesToMilliseconds(5)
				})
				.then(async modalInteraction => {
					console.log('interaction received');
					console.log('reached name');
					const name =
						modalInteraction.fields.getTextInputValue('name-input');
					await updateProfile(
						{
							'battleSystem.penguin': value,
							'battleSystem.penguinName': name
						},
						selectMenuInteraction.user.id
					);
					console.log('updated profile');
					await modalInteraction.reply({
						embeds: [
							new EmbedBuilder()
								.setColor(0xaf7ac5)
								.setAuthor({
									name: selectMenuInteraction.member.displayName,
									iconURL:
										selectMenuInteraction.member.displayAvatarURL()
								})
								.setDescription(
									`You adopted a **${value}** penguin!
Their name is **${name}**`
								)
								.setThumbnail(penguinData[value])
								.setFooter({
									text: 'Your penguin currently has its battle shield activated. Use /battle shield disable to deactivate it.'
								})
						]
					});
				})
				.catch(err => {
					interaction.followUp({
						content:
							"You didn't choose a name in time. Please try selecting your penguin again."
					});
				});
		});
	});

export default adopt;
