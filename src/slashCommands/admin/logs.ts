import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import prettyMs from "pretty-ms";
import ms from "ms";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("logs")
	.setDescription("MOD: view the logs of a user")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to view the logs of")
			.setRequired(true)
	);
export const permissions = ["MANAGE_MESSAGES"];
export async function run({
	interaction,
	server,
	profileInServerOf,
}: CommandData) {
	await interaction.deferReply();
	const user = interaction.options.getUser("user");
	const profileInServer = await profileInServerOf(user.id);
	if (!profileInServer.infractions) {
		await interaction.editReply(`${user.toString()}'s logs are clean!`);
		return;
	}
	const format = profileInServer.infractions.slice(-120).map((i) => {
		const dateFormat = dayjs
			.tz(i.date, server.timezone)
			.format("ddd [*]MMM, D, YYYY[*] hh:mm A");
		return {
			title: i.infractionType,
			description: `Reason: *${i.reason ? i.reason : "No reason provided"}*
Date: ${dateFormat}`,
			time: i.time,
		};
	});
	const sliced = chunkArray(format, 8);
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
		.setDisabled(sliced.length <= 10);
	let row = new MessageActionRow().addComponents(previous, next);
	let currentPage = 0;

	const embed = new MessageEmbed()
		.setTitle("Mod Logs")
		.setAuthor(`${user.tag}`, user.avatarURL())
		.setFooter(`Page 1/${sliced.length}`)
		.setColor("#FF9433");
	for (const s of sliced[0]) {
		let desc = s.description;
		if (s.time) desc += `\nTime: ${prettyMs(s.time)}`;
		embed.addField(s.title, s.description);
	}
	await interaction.editReply({ embeds: [embed] });
	const msg = await interaction.fetchReply();

	if (sliced.length <= 10) return;
	const collector = msg.createMessageComponentCollector({ time: ms("2h") });

	collector.on("collect", async (i) => {
		if (i.customId == "prev") {
			currentPage--;
			next.setDisabled(false);
			if (currentPage == 0) previous.setDisabled();
			for (const s of sliced[currentPage]) {
				embed.fields = [];
				let desc = s.description;
				if (s.time) desc += `\nTime: ${prettyMs(s.time)}`;
				embed.addField(s.title, s.description);
			}
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({ embeds: [embed], components: [row] });
		} else {
			currentPage++;
			previous.setDisabled(false);
			if (currentPage + 1 == sliced.length) next.setDisabled();
			for (const s of sliced[currentPage]) {
				embed.fields = [];
				let desc = s.description;
				if (s.time) desc += `\nTime: ${prettyMs(s.time)}`;
				embed.addField(s.title, s.description);
			}
			row = new MessageActionRow().addComponents(previous, next);
			await i.update({ embeds: [embed], components: [row] });
		}
	});
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
