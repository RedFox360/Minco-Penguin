import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import ms from "ms";

export const data = new SlashCommandBuilder()
	.setName("leaderboard")
	.setDescription("View the Minco Dollar leaderboard of the server");

export async function run({ interaction, profileOf }: CommandData) {
	await interaction.deferReply();
	const members = await interaction.guild.members.fetch({
		limit: 100,
	});
	let formatted = [];
	for (const member of members.values()) {
		let profile = await profileOf(member.user.id);
		if (!profile || member.user.bot) continue;
		let total = profile.mincoDollars + profile.bank;
		formatted.push([
			`**${member.displayName}**: ${total.toLocaleString()} MD`,
			total,
			member.id,
		]);
	}
	formatted = formatted
		.sort((a, b) => b[1] - a[1])
		.map((val, index) => [`${index + 1} ${val[0]}`, val[1], val[2]]);
	const slices = chunkArray(formatted, 10);
	const authorIndex = formatted.findIndex((e) => e[2] === interaction.user.id);
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
		.setStyle("PRIMARY")
		.setDisabled(formatted.length <= 10);

	let row = new MessageActionRow().addComponents(previous, next);
	let currentPage = 0;

	const lbEmbed = new MessageEmbed()
		.setTitle("Leaderboard")
		.setColor("#E67E22") //orange
		.setDescription(format(slices[0]))
		.setFooter(
			`Page 1/${slices.length} • Your leaderboard rank: ${authorIndex + 1}`
		);

	await interaction.editReply({
		embeds: [lbEmbed],
		components: [row],
	});
	const msg = await interaction.fetchReply();

	if (formatted.length <= 10) return;
	const collector = msg.createMessageComponentCollector({ time: ms("2h") });

	collector.on("collect", async (i) => {
		if (i.customId == "prev") {
			currentPage--;
			next.setDisabled(false);
			if (currentPage == 0) {
				previous.setDisabled();
			}
			lbEmbed
				.setDescription(format(slices[currentPage]))
				.setFooter(
					`Page ${currentPage + 1}/${slices.length} • Your leaderboard rank: ${
						authorIndex + 1
					}`
				);
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({
				embeds: [lbEmbed],
				components: [row],
			});
		} else {
			currentPage++;
			previous.setDisabled(false);
			if (currentPage + 1 == slices.length) {
				next.setDisabled();
			}
			lbEmbed
				.setDescription(format(slices[currentPage]))
				.setFooter(
					`Page ${currentPage + 1}/${slices.length} • Your leaderboard rank: ${
						authorIndex + 1
					}`
				);
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({
				embeds: [lbEmbed],
				components: [row],
			});
		}
	});
}
function format(arr) {
	return arr.map((a) => a[0]).join("\n");
}
function chunkArray<T>(myArray: T[], chunkSize: number): T[][] {
	const tempArray = [];

	for (let index = 0; index < myArray.length; index += chunkSize) {
		const myChunk = myArray.slice(index, index + chunkSize);
		// Do something if you want with the group
		tempArray.push(myChunk);
	}

	return tempArray;
}
