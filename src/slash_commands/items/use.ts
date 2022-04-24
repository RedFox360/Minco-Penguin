import { randomInt } from 'mathjs';
import { CommandInteraction } from 'discord.js';
import { getProfile, updateProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const use = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('use')
			.setDescription('Use your items!')
			.addStringOption(option =>
				option
					.setName('item')
					.setDescription('The item to use')
					.setRequired(true)
					.addChoice('Lootbox', 'lootbox')
					.addChoice('Tomato', 'tomato')
					.addChoice('Banana', 'banana')
			)
	)
	.setCooldown(12)
	.setRun(async interaction => {
		const { inventory, gems } = await getProfile(
			interaction.user.id
		);
		const item = interaction.options.getString('item');
		if (item === 'lootbox') {
			lootbox(interaction, inventory, gems);
		} else if (item === 'tomato') {
			tomato(interaction, inventory);
		} else if (item === 'banana') {
			banana(interaction, inventory);
		}
	});

async function tomato(
	interaction: CommandInteraction<'cached'>,
	inventory: string[]
) {
	if (!inventory.includes('04')) {
		await interaction.reply({
			content: "You don't have a tomato!",
			ephemeral: true
		});
		return;
	}
	if (randomInt(0, 700) === 0) {
		interaction.reply(
			'The Minco dice have decided you will win **100** Minco Dollars!'
		);
		await updateProfile(
			{
				$inc: { mincoDollars: 100 },
				$pull: { inventory: '04' }
			},
			interaction.user.id
		);
		return;
	}
	const randnum = randomInt(2, 6);
	await updateProfile(
		{
			$inc: { mincoDollars: randnum },
			$pull: { inventory: '04' }
		},
		interaction.user.id
	);
	interaction.reply(
		`You ate your fresh tomato and won ${randnum} Minco Dollars!`
	);
}
async function lootbox(
	interaction: CommandInteraction<'cached'>,
	inventory: string[],
	gems: string[]
) {
	let replied = false;
	if (!inventory.includes('10')) {
		await interaction.reply({
			content: "You don't have a lootbox!",
			ephemeral: true
		});
		return;
	}
	const mincoAmount = randomInt(35, 65);
	await updateProfile(
		{
			$inc: { mincoDollars: mincoAmount },
			$pull: { inventory: '10' }
		},
		interaction.user.id
	);
	if (Math.floor(Math.random() * 20) === 0) {
		const g = gems[0];
		const gem = g[Math.floor(Math.random() * g.length)];

		if (!gems.includes(gem as string)) {
			let gemName: string;
			for (const { number, name } of gems[1] as any) {
				if (gem === number) {
					gemName = name;
					break;
				}
			}
			await updateProfile(
				{ $push: { gems: gem } },
				interaction.user.id
			);

			await interaction.reply(`You won a ${gemName}!`);
			replied = true;
		}
	}
	if (Math.floor(Math.random() * 4) === 0) {
		if (inventory.includes('05')) {
			await updateProfile(
				{
					$inc: { candyAmount: 3 }
				},
				interaction.user.id
			);
		} else {
			await updateProfile(
				{
					$push: {
						inventory: '05'
					},
					candyAmount: 3
				},
				interaction.user.id
			);
		}
		if (!replied) {
			await interaction.reply('You won a Candy :candy:!');
			replied = true;
		} else {
			await interaction.followUp('You won a Candy :candy:!');
		}
	}
	if (!replied) {
		await interaction.reply(
			`You won ${mincoAmount} Minco Dollars!`
		);
	} else {
		await interaction.followUp(
			`You won ${mincoAmount} Minco Dollars!`
		);
	}
}

async function banana(
	interaction: CommandInteraction<'cached'>,
	inventory: string[]
) {
	if (!inventory.includes('12')) {
		await interaction.reply({
			content: "You don't have a banana!",
			ephemeral: true
		});
		return;
	}
	const randnum = randomInt(5, 16); // 5-15 (average: 10 - price of banana)
	await updateProfile(
		{
			$inc: { mincoDollars: randnum },
			$pull: { inventory: '12' }
		},
		interaction.user.id
	);
	await interaction.reply(
		`You ate your banana and won ${randnum} Minco Dollars!`
	);
}

export default use;
