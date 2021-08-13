import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";

export const data = {
	name: "zoo",
	description: "View your Minco Zoo!",
	options: [
		{
			name: "view_type",
			description: "How to view the zoo",
			type: "STRING",
			required: true,
			choices: [
				{
					name: "Compact",
					value: "compact",
				},
				{
					name: "List",
					value: "list",
				},
			],
		},
		{
			name: "user",
			description: "The user whose zoo to view",
			type: "USER",
			required: false,
		},
	],
};

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
		.setFooter(interaction.guild.name);

	await interaction.reply({ embeds: [zooEmbed] });
}
