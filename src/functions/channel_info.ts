import { CommandData } from "../types";
import { GuildChannel, MessageEmbed } from "discord.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import prettyMs from "pretty-ms";
dayjs.extend(utc);
dayjs.extend(timezone);

export default async function run({ interaction, profile }: CommandData) {
	await interaction.deferReply();
	const channel = interaction.options.getChannel("channel") as GuildChannel;
	const type = (() => {
		switch (channel.type) {
			case "GUILD_CATEGORY":
				return "category";
			case "GUILD_NEWS":
				return "news";
			case "GUILD_NEWS_THREAD":
				return "news thread";
			case "GUILD_PRIVATE_THREAD":
				return "private thread";
			case "GUILD_PUBLIC_THREAD":
				return "thread";
			default:
				return "other";
		}
	})();
	const embed = new MessageEmbed()
		.setTitle("Channel Info")
		.setColor("#DFBE33")
		.addFields(
			{
				name: ":name_badge: Name",
				value: "*" + channel.name + "*",
				inline: true,
			},
			{
				name: ":id: ID",
				value: "`" + channel.id + "`",
				inline: true,
			},
			{
				name: ":speech_balloon: Type",
				value: "`" + type + "`",
				inline: true,
			},
			{
				name: "Created at",
				value: formatTime(channel.createdAt, profile.timezone),
				inline: true,
			}
		);
	if (channel.isText()) {
		const { threads } = await channel.threads.fetchActive();
		if (threads.size) {
			embed.addField(
				"Active Threads",
				Array.from(threads.values())
					.map((thread) => thread.name)
					.join("\n"),
				true
			);
		}
	}
	if (channel.isText() && channel.topic) {
		embed.addField("Description", "`" + channel.topic + "`", true);
	}
	const isPrivate = channel
		.permissionsFor(interaction.guild.roles.everyone)
		.has("VIEW_CHANNEL");
	embed.addField("Private", "`" + isPrivate + "`", true);

	await interaction.editReply({ embeds: [embed] });
}
const formatTime = (time: Date, timezone: string) => {
	const currentTime = Date.now();
	const creationTime = dayjs.tz(time, timezone);
	const timeBetween = prettyMs(currentTime - creationTime.valueOf(), {
		unitCount: 2,
		verbose: true,
	});

	return `${formatDate(creationTime)}
(*${timeBetween}* ago)`;
};

const formatDate = (date: dayjs.Dayjs) => date.format("MMM DD, YYYY h:mm A");
