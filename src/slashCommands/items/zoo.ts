import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("zoo")
	.setDescription("View your Minco Zoo!")
	.addStringOption((option) =>
		option
			.setName("view_type")
			.setDescription("How to view the zoo")
			.setRequired(true)
			.addChoice("Compact", "compact")
			.addChoice("List", "list")
	)
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user whose zoo to view")
			.setRequired(false)
	);

export async function run({ interaction, profileOf }: CommandData) {
	const animals = [];
	const viewType = interaction.options.getString("view_type");
	const userExists = interaction.options.getUser("user");
	const user = userExists ?? interaction.user;
	const { zoo } = await profileOf(user.id);
	if (!zoo.length) {
		await interaction.reply({
			content: `${
				userExists ? `${userExists} doesn't` : "You don't"
			} have any animals in ${userExists ? `their` : "your"} zoo`,
			ephemeral: true,
		});
		return;
	}
	for (let i = 1; i <= zoo.length; i++) {
		if (viewType == "list") {
			const { name, emoji } = zoo[i - 1];
			let end = i % 2 === 0 ? "\n" : " ";
			let animal = `${emoji} ${name}${end}`;
			animals.push(animal);
		} else {
			let end = i % 5 === 0 ? "\n" : " ";
			let animal = zoo[i - 1].emoji + end;
			animals.push(animal);
		}
	}

	const zooEmbed = new MessageEmbed()
		.setAuthor("Minco Zoo", user.avatarURL())
		.setColor("#F4D03F")
		.setDescription(animals.join(""))
		.setFooter(interaction.guild?.name ?? interaction.user.username);

	await interaction.reply({ embeds: [zooEmbed] });
}
