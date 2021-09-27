import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the info of a user")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to get info from")
			.setRequired(true)
	);

export async function run({ interaction, profile }: CommandData) {
	const user = interaction.options.getUser("user");
	const member = await interaction.guild.members.fetch(user.id);
	const roles = Array.from(member.roles.cache.values());
	const infoEmbed = new MessageEmbed()
		.setAuthor(user.tag, user.avatarURL(), user.avatarURL())
		.setColor("#16A085") // darkish green
		.addFields(
			{
				name: "Roles",
				value: roles
					.filter((role) => !role.name.includes("everyone"))
					.map((role) => `<@&${role.id}>`)
					.join(" "),

				inline: true,
			},
			{
				name: "Created at",
				value: format(user.createdAt, profile.timezone),
				inline: true,
			},
			{
				name: "Joined at",
				value: format(member.joinedAt, profile.timezone),
				inline: true,
			}
		)
		.setFooter(`UID: ${user.id} | Timezone: ${profile.timezone}`)
		.setTimestamp();
	await interaction.reply({ embeds: [infoEmbed] });
}

const format = (time, timezone) =>
	dayjs.tz(time, timezone).format("ddd [**]MMM D, YYYY[**] hh:mm A");
