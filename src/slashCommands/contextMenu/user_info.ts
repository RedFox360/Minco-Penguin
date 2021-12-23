import { ContextMenuCommandBuilder, time } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { ContextMenuData, ContextMenuTypes } from "../../types";
export const data = new ContextMenuCommandBuilder()
	.setName("User Info")
	.setType(ContextMenuTypes.User);

export async function run({ interaction, profileOf }: ContextMenuData) {
	const user = await interaction.client.users.fetch(interaction.targetId);
	const member = await interaction.guild.members.fetch(user.id);
	const profile = await profileOf(interaction.targetId);
	const roles = Array.from(member.roles.cache.values());
	const infoEmbed = new MessageEmbed()
		.setAuthor(
			user.tag,
			member.displayAvatarURL({ dynamic: true }),
			member.displayAvatarURL({ dynamic: true })
		)
		.setColor(member.roles.highest.color || "GREYPLE")
		.addFields(
			{
				name: "Created at",
				value: time(user.createdAt),
				inline: true,
			},
			{
				name: "Joined at",
				value: time(member.joinedAt),
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
