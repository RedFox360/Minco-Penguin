import {
	CommandInteraction,
	GuildMember,
	MessageEmbed,
	UserContextMenuInteraction
} from 'discord.js';
import emojis from './fish_emojis';
import fishJSON from '../json/fish.json';
import { getProfile } from './models';

export default async function run(
	interaction:
		| CommandInteraction<'cached'>
		| UserContextMenuInteraction<'cached'>,
	member: GuildMember
) {
	const { user } = member;
	const { fish } = await getProfile(user.id);
	const avatar = member.displayAvatarURL({ dynamic: true });
	const embed = new MessageEmbed()
		.setColor('#D5f5E3')
		.setAuthor({ name: 'Fishing Profile', iconURL: avatar })
		.addField(
			`${emojis.sparkle} EXP`,
			fish.xp.toLocaleString(interaction.locale),
			true
		);
	if (fish.rod)
		embed.addField(
			`${emojis.rod} Rod`,
			`${
				fish.rod.charAt(0).toUpperCase() + fish.rod.slice(1)
			} rod`,
			true
		);
	// if (fish.baitType) {
	// 	embed.addField(
	// 		'Bait',
	// 		`Bait Type: ${fish.baitType} | Amount: ${fish.baits}`
	// 	);
	// }
	fish.fishInventory.forEach((amount, fishName) => {
		if (amount > 0)
			embed.addField(
				`${emojis[fishName]} ${capitalizeFirstLetter(
					fishJSON[fishName].formattedNames[1]
				)}`,
				amount.toLocaleString(interaction.locale),
				true
			);
	});
	await interaction.reply({ embeds: [embed] });
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
