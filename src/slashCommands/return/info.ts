import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = {
	name: "info",
	description: "Get the info of a user",
	options: [
		{
			name: "user",
			description: "The user to get info from",
			type: "USER",
			required: true,
		},
	],
};

export async function run({ interaction }: CommandData) {
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
				value: format(user.createdAt),
				inline: true,
			},
			{
				name: "Joined at",
				value: format(member.joinedAt),
				inline: true,
			}
		)
		.setFooter(`UID: ${user.id}`)
		.setTimestamp();
	await interaction.reply({ embeds: [infoEmbed] });
}

const format = (time) =>
	dayjs
		.tz(time, "America/Los_Angeles")
		.format("ddd [**]MMM D, YYYY[**] hh:mm A [PST]");
