import {
	CommandInteraction,
	GuildMember,
	MessageEmbed,
	UserContextMenuInteraction
} from 'discord.js';
import { time, userMention } from '@discordjs/builders';
import { format } from 'date-fns';
import { getProfile } from './models';

export default async function run(
	interaction:
		| CommandInteraction<'cached'>
		| UserContextMenuInteraction<'cached'>,
	member: GuildMember
) {
	const { favs, spouse, birthday } = await getProfile(member.id);
	const roles = Array.from(member.roles.cache.values());
	const avatar = member.displayAvatarURL({ dynamic: true });
	const infoEmbed = new MessageEmbed()
		.setAuthor({
			name: member.user.tag,
			url: avatar,
			iconURL: avatar
		})
		.setColor(member.roles.highest.color || 'GREYPLE') // darkish green
		.setFields(
			{
				name: 'Created at',
				value: time(member.user.createdAt),
				inline: true
			},
			{
				name: 'Joined at',
				value: time(member.joinedAt),
				inline: true
			}
		)
		.setFooter({ text: `User ID: ${member.id}` })
		.setTimestamp();

	if (birthday) {
		const date = new Date(birthday);
		const formatted = format(
			date,
			getDateFormat(
				interaction.locale,
				date.getFullYear() === 2001
			)
		);
		infoEmbed.addField('Birthday', formatted, true);
	}
	if (roles.length > 1) {
		infoEmbed.addField(
			'Roles',
			roles
				.filter(role => !role.name.includes('everyone'))
				.map(role => role.toString())
				.join(' '),
			true
		);
	}
	let favDesc: string;
	if (favs.food) {
		favDesc = 'Food: ' + favs.food;
	}
	if (favs.color) {
		favDesc += '\nColor: ' + favs.color;
	}
	if (favs.animal) {
		favDesc += '\nAnimal: ' + favs.animal;
	}
	if (favDesc) infoEmbed.addField('Favorites', favDesc, true);
	if (spouse) {
		let spouseFormat: string;
		try {
			await interaction.guild.members.fetch(spouse);
			spouseFormat = userMention(spouse);
		} catch {
			const user = await interaction.client.users.fetch(spouse);
			spouseFormat = user.username;
		}
		infoEmbed.addField('Married to', spouseFormat, true);
	}
	await interaction.reply({ embeds: [infoEmbed] });
}
function getDateFormat(locale: string, hasYear: boolean) {
	if (locale === 'en-US') {
		return hasYear ? 'MMM d' : 'MMM d, y';
	} else {
		return hasYear ? 'd MMM' : 'd MMM y';
	}
}
