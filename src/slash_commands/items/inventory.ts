import { EmbedBuilder } from 'discord.js';
import { getProfile } from '../../functions/models';
import { SlashCommand } from '../../types';

const inventory = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('inventory')
			.setDescription('View your inventory!')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to view the inventory of')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const memberExists = interaction.options.getMember('user');
		const member = memberExists ?? interaction.member;
		const { inventory } = await getProfile(member.id);
		if (!inventory.length) {
			await interaction.reply(
				`${
					memberExists ? `${member} doesn't` : "You don't"
				} have any items in ${
					memberExists ? 'their' : 'your'
				} inventory.`
			);
			return;
		}

		const inv = inventory
			.map(t => {
				if (t === '01') return ':ring: Marriage Ring';
				if (t === '02')
					return ':diamond_shape_with_a_dot_inside: Diamond Crown';
				if (t === '03') return ':cowboy: Cowboy Hat';
				if (t === '04') return ':tomato: Tomato';
				if (t === '05') return ':candy: Candy';
				if (t === '06')
					return `<:transparent_jellybot:833491227995013130> Jellyfish`;
				if (t === '07') return ':bear: Bear';
				if (t === '08') return ':cactus: Cactus';
				if (t === '09') return ':fire: Fire';
				if (t === '10')
					return '<:cardboard_box:843173235549667349> Lootbox';
				if (t === '12') return ':banana: Banana';
			})
			.map((t, i) => `${i + 1}. ${t}`);
		const avatar = member.displayAvatarURL();

		const invEmbed = new EmbedBuilder()
			.setAuthor({
				name: `${member.displayName}'s Inventory`,
				iconURL: avatar
			})
			.setDescription(inv.join('\n'))
			.setColor(0xf8c471)
			.setFooter({
				text: interaction.guild?.name ?? interaction.user.username
			});
		interaction.reply({ embeds: [invEmbed] });
	});

export default inventory;
