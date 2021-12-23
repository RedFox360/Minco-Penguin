import { CommandData } from "../types";
import { MessageEmbed } from "discord.js";
import { time } from "@discordjs/builders";
import dayjs from "dayjs";

export default async function run({ interaction, profileOf }: CommandData) {
	const user = interaction.options.getUser("user");
	const { favs, spouse, birthday, inventory } = await profileOf(user.id);
	const member = await interaction.guild.members.fetch(user.id);
	const roles = Array.from(member.roles.cache.values());
	const infoEmbed = new MessageEmbed()
		.setAuthor(
			user.tag,
			user.displayAvatarURL({ dynamic: true }),
			user.displayAvatarURL({ dynamic: true })
		)
		.setColor(member.roles.highest.color || "GREYPLE") // darkish green
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
		.setFooter(`User ID: ${user.id}`)
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
	let favDesc: string;
	if (favs.food) {
		favDesc = "Food: " + favs.food;
	}
	if (favs.color) {
		favDesc += "\nColor: " + favs.color;
	}
	if (favs.animal) {
		favDesc += "\nAnimal: " + favs.animal;
	}
	if (favDesc) infoEmbed.addField("Favorites", favDesc, true);
	if (birthday) {
		const date = dayjs(birthday);
		let formatted: string;
		if (date.year() === 2001) {
			formatted = date.format("MMMM D");
		} else {
			formatted = date.format("MMMM D, YYYY");
		}
		infoEmbed.addField("Birthday", formatted, true);
	}
	if (spouse) {
		let spouseFormat: string;
		try {
			await interaction.guild.members.fetch(spouse);
			spouseFormat = `<@${spouse}>`;
		} catch (err) {
			let user = await interaction.client.users.fetch(spouse);
			spouseFormat = user.username;
		}
		infoEmbed.addField("Married to", spouseFormat, true);
	}
	await interaction.reply({ embeds: [infoEmbed] });
}
