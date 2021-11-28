import { CommandData } from "../types";
import { MessageEmbed } from "discord.js";

export default async function run({ interaction, profile }: CommandData) {
	const user = interaction.options.getUser("user");
	const member = await interaction.guild.members.fetch(user.id);
	const roles = Array.from(member.roles.cache.values());
	console.table({
		createdTimestamp: user.createdTimestamp,
		joinedAt: member.joinedTimestamp,
	});
	const infoEmbed = new MessageEmbed()
		.setAuthor(
			user.tag,
			user.avatarURL({ dynamic: true }),
			user.avatarURL({ dynamic: true })
		)
		.setColor(member.roles.highest.color || "GREYPLE") // darkish green
		.addFields(
			{
				name: "Created at",
				value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`,
				inline: true,
			},
			{
				name: "Joined at",
				value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`,
				inline: true,
			}
		)
		.setFooter(`UID: ${user.id} | Timezone: ${profile.timezone}`)
		.setTimestamp();
	if (roles.length > 1) {
		infoEmbed.addField(
			"Roles",
			roles
				.filter((role) => !role.name.includes("everyone"))
				.map((role) => `<@&${role.id}>`)
				.join(" "),
			true
		);
	}
	await interaction.reply({ embeds: [infoEmbed] });
}
