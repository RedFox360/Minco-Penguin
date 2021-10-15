import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import prettyMs from "pretty-ms";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("info")
	.setDescription("Get the info of a user")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("member")
			.setDescription("View the info of a member in the server")
			.addUserOption((option) =>
				option
					.setName("user")
					.setDescription("The user to get info from")
					.setRequired(true)
			)
	)
	.addSubcommand((subcommand) =>
		subcommand.setName("server").setDescription("View the info of this server")
	);

export async function run({ interaction, server, profile }: CommandData) {
	switch (interaction.options.getSubcommand()) {
		case "member": {
			const user = interaction.options.getUser("user");
			const member = await interaction.guild.members.fetch(user.id);
			const roles = Array.from(member.roles.cache.values());

			const infoEmbed = new MessageEmbed()
				.setAuthor(user.tag, user.avatarURL(), user.avatarURL())
				.setColor(member.roles.highest.color || "GREYPLE") // darkish green
				.addFields(
					{
						name: "Created at",
						value: formatTime(user.createdAt, profile.timezone),
						inline: true,
					},
					{
						name: "Joined at",
						value: formatJoined(
							member.joinedAt,
							profile.timezone,
							interaction.guild.createdAt
						),
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
			break;
		}
		case "server": {
			await interaction.deferReply();
			const channels = await interaction.guild.channels.fetch();
			const textChannelAmount = channels.filter((channel) =>
				channel.isText()
			).size;
			const voiceChannelAmount = channels.filter((channel) =>
				channel.isVoice()
			).size;
			const categoryAmount = channels.filter(
				(channel) => channel.type === "GUILD_CATEGORY"
			).size;
			const roleAmount = (await interaction.guild.roles.fetch()).size;
			const totalChannelAmount = textChannelAmount + voiceChannelAmount;
			const emojiCount = (await interaction.guild.emojis.fetch()).size;
			const roleCount = (await interaction.guild.roles.fetch()).size;
			const verificationLevel = (() => {
				switch (interaction.guild.verificationLevel) {
					case "NONE":
						return "`None`";
					case "LOW":
						return "`Low`";
					case "MEDIUM":
						return "`Medium`";
					case "HIGH":
						return "`High`";
					case "VERY_HIGH":
						return "`Very High`";
				}
			})();
			const infoEmbed = new MessageEmbed()
				.setThumbnail(interaction.guild.iconURL())
				.setTitle("Server Info")
				.setColor("BLURPLE")
				.addFields(
					{
						name: "Name",
						value: "`" + interaction.guild.name + "`",
						inline: true,
					},
					{
						name: "ID",
						value: "`" + interaction.guild.id + "`",
						inline: true,
					},
					{
						name: "Server owner",
						value: `<@${interaction.guild.ownerId}>`,
						inline: true,
					},
					{
						name: "Created at",
						value: formatTime(interaction.guild.createdAt, profile.timezone),
						inline: true,
					},
					{
						name: "Channel amounts",
						value: `Text: \`${textChannelAmount}\`  |  Voice: \`${voiceChannelAmount}\`  |  Categories: \`${categoryAmount}\`  |  Total: \`${totalChannelAmount}\``,
						inline: true,
					},
					{
						name: "Server Timezone",
						value: `\`${server.timezone}\`
Current time: ${dayjs().tz(server.timezone).format("MMM DD hh:mm A")}`,
						inline: true,
					},
					{
						name: "Member Count",
						value: `Non Bots: \`${server.memberCount}\``,
						inline: true,
					},
					{
						name: "Highest Role",
						value: interaction.guild.roles.highest.toString(),
						inline: true,
					},
					{
						name: "Role amount",
						value: "`" + roleAmount.toLocaleString() + "`",
						inline: true,
					},
					{
						name: "Partnered",
						value: "`" + interaction.guild.partnered + "`",
						inline: true,
					},
					{
						name: "Verified",
						value: "`" + interaction.guild.verified + "`",
						inline: true,
					},
					{
						name: "Emoji Count",
						value: "`" + emojiCount + "`",
						inline: true,
					},
					{
						name: "Role Count",
						value: "`" + roleCount + "`",
						inline: true,
					},
					{
						name: "System Channel",
						value: (interaction.guild.systemChannel ?? "`None`").toString(),
						inline: true,
					},
					{
						name: "Verification Level",
						value: verificationLevel,
						inline: true,
					}
				)
				.setFooter(`Server ID: ${interaction.guild.id}`);
			await interaction.editReply({ embeds: [infoEmbed] });
		}
	}
}

const formatJoined = (time, timezone, createdAt) => {
	const creationTime = dayjs.tz(time, timezone);
	const timeBetween = prettyMs(creationTime.valueOf() - createdAt, {
		unitCount: 3,
		verbose: true,
	});

	return `${formatDate(creationTime)}
*${timeBetween}* after the server was created`;
};
const formatTime = (time, timezone) => {
	const currentTime = Date.now();
	const creationTime = dayjs.tz(time, timezone);
	const timeBetween = prettyMs(currentTime - creationTime.valueOf(), {
		unitCount: 2,
		verbose: true,
	});

	return `${formatDate(creationTime)} (*${timeBetween}* ago)`;
};

const formatDate = (date: dayjs.Dayjs) => date.format("MMM DD, YYYY h:mm A");
