import {
	ChatInputCommandInteraction,
	GuildMember,
	UserContextMenuCommandInteraction
} from 'discord.js';
import emojis from './fish_emojis';
import fishJSON from '../../json/fish.json';
import { getProfile } from '../models';
import chunkArray from '../basics/chunk_array';
import { EmbedBuilder } from 'discord.js';

export default async function run(
	interaction:
		| ChatInputCommandInteraction<'cached'>
		| UserContextMenuCommandInteraction<'cached'>,
	member: GuildMember
) {
	const { user } = member;
	const { fish } = await getProfile(user.id);
	const avatar = member.displayAvatarURL();
	const embeds = [
		new EmbedBuilder()
			.setColor(0xd5f5e3)
			.setAuthor({ name: 'Fishing Profile', iconURL: avatar })
			.addFields({
				name: `${emojis.sparkle} EXP`,
				value: fish.xp.toLocaleString(interaction.locale),
				inline: true
			})
	];
	if (fish.rod)
		embeds[0].addFields({
			name: `${emojis.rod} Rod`,
			value: `${
				fish.rod.charAt(0).toUpperCase() + fish.rod.slice(1)
			} rod`,
			inline: true
		});
	// if (fish.baitType) {
	// 	embed.addFields(
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
					name: `${emojis[fishName]} ${capitalizeFirstLetter(
						fishJSON[fishName].formattedNames[1]
					)}`,
					value: amount.toLocaleString(interaction.locale),
					inline: true
				});
		});
		const chunkedFish = chunkArray(fishFields, 20);
		embeds[0].addFields(...chunkedFish[0]);
		if (chunkedFish.length > 1) {
			chunkedFish.shift();
			chunkedFish.forEach((fields, index) => {
				embeds[index + 1] = new EmbedBuilder()
					.setColor(0xd5f5e3)
					.addFields(...fields);
			});
		}
	} else {
		embeds[0].setDescription("You don't have any fish");
	}
	await interaction.reply({
		embeds: embeds.map(embed => embed)
	});
}

function capitalizeFirstLetter(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}
