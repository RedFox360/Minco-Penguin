import {
	CommandInteraction,
	GuildMember,
	MessageEmbed,
	UserContextMenuInteraction
} from 'discord.js';
import emojis from './fish_emojis';
import fishJSON from '../json/fish.json';
import { getProfile } from './models';
import chunkArray from './chunkArray';

export default async function run(
	interaction:
		| CommandInteraction<'cached'>
		| UserContextMenuInteraction<'cached'>,
	member: GuildMember
) {
	const { user } = member;
	const { fish } = await getProfile(user.id);
	const avatar = member.displayAvatarURL({ dynamic: true });
	const embeds = [
		new MessageEmbed()
			.setColor('#D5f5E3')
			.setAuthor({ name: 'Fishing Profile', iconURL: avatar })
			.addField(
				`${emojis.sparkle} EXP`,
				fish.xp.toLocaleString(interaction.locale),
				true
			)
	];
	if (fish.rod)
		embeds[0].addField(
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
	if (Array.from(fish.fishInventory.values()).some(a => a > 0)) {
		const fishFields: {
			name: string;
			value: string;
			inline: boolean;
		}[] = [];
		fish.fishInventory.forEach((amount, fishName) => {
			if (amount > 0)
				fishFields.push({
					name: `${
						emojis[fishName]
					} ${capitalizeFirstLetter(
						fishJSON[fishName].formattedNames[1]
					)}`,
					value: amount.toLocaleString(interaction.locale),
					inline: true
				});
		});
		const chunkedFish = chunkArray(fishFields, 20);
		embeds[0].addFields(chunkedFish[0]);
		if (chunkedFish.length > 1) {
			chunkedFish.shift();
			chunkedFish.forEach((fields, index) => {
				embeds[index + 1] = new MessageEmbed()
					.setColor('#D5f5E3')
					.setFields(fields);
			});
		}
	} else {
		embeds[0].setDescription("You don't have any fish");
	}
	await interaction.reply({ embeds });
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
