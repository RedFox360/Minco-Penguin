import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton } from "discord.js";
import ms from "ms";
import animalList from "../../json/animals.json";
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
			.addChoice("Animal List", "animal_list")
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
	if (viewType == "animal_list") {
		viewAnimalList({ interaction } as any);
		return;
	}
	const userExists = interaction.options.getUser("user");
	const user = userExists ?? interaction.user;
	const { zoo } = await profileOf(user.id);
	if (!zoo.length) {
		await interaction.reply(
			`${
				userExists ? `${userExists} doesn't` : "You don't"
			} have any animals in ${userExists ? `their` : "your"} zoo`
		);
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
		.setAuthor("Minco Zoo", user.avatarURL({ dynamic: true }))
		.setColor("#F4D03F")
		.setDescription(animals.join(""))
		.setFooter(interaction.guild?.name ?? interaction.user.username);

	await interaction.reply({ embeds: [zooEmbed] });
}

async function viewAnimalList({ interaction }: CommandData) {
	const perGroup = Math.ceil(animalList.length / 3);
	const animalSlices = new Array(3)
		.fill("")
		.map((_, i) => animalList.slice(i * perGroup, (i + 1) * perGroup));

	const previous = new MessageButton()
		.setCustomId("prev")
		.setLabel("Previous")
		.setStyle("PRIMARY")
		.setEmoji("⬅️")
		.setDisabled();
	const next = new MessageButton()
		.setCustomId("next")
		.setLabel("Next")
		.setEmoji("➡️")
		.setStyle("PRIMARY");
	let row = new MessageActionRow().addComponents(previous, next);
	let currentPage = 0;
	const msg = await interaction.reply({
		content: format(animalSlices[currentPage]),
		components: [row],
		fetchReply: true,
	});

	const filter = (i) => i.user.id === interaction.user.id;
	const collector = msg.createMessageComponentCollector({
		filter,
		time: ms("2h"),
	});

	collector.on("collect", async (i) => {
		if (i.customId === "prev") {
			currentPage--;
			next.setDisabled(false);
			if (currentPage == 0) {
				previous.setDisabled();
			}
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({
				content: format(animalSlices[currentPage]),
				components: [row],
			});
		} else {
			currentPage++;
			previous.setDisabled(false);
			if (currentPage == 2) {
				next.setDisabled();
			}
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({
				content: format(animalSlices[currentPage]),
				components: [row],
			});
		}
	});
}
function format(animalArr) {
	return animalArr.map((value) => `${value.emoji} ${value.name}`).join("\n");
}
