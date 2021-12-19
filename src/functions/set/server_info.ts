import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import ordinal from "ordinal";

export default async function run({ interaction, server }: CommandData) {
	await interaction.deferReply();
	const channels = await interaction.guild.channels.fetch();
	const textChannelAmount = channels.filter((channel) => channel.isText()).size;
	const voiceChannelAmount = channels.filter((channel) =>
		channel.isVoice()
	).size;
	const categoryAmount = channels.filter(
		(channel) => channel.type === "GUILD_CATEGORY"
	).size;
	const roleAmount = (await interaction.guild.roles.fetch()).size;
	const totalChannelAmount = textChannelAmount + voiceChannelAmount;
	const emojiCount = (await interaction.guild.emojis.fetch()).size;
	const welcomeMessage = replace(
		server.welcomeMessage,
		interaction,
		server.memberCount
	);

	const leaveMessage = replace(
		server.leaveMessage,
		interaction,
		server.memberCount
	);

	const welcomeDM = server.welcomeDM
		? replace(server.welcomeDM, interaction, server.memberCount)
		: "`None`";
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
		.setAuthor(
			"Minco Penguin",
			interaction.guild.iconURL({ dynamic: true }),
			interaction.guild.iconURL()
		)
		.setTitle(":bulb: Server Info")
		.setColor("#DFBE33")
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
				value: `<t:${Math.floor(interaction.guild.createdTimestamp / 1000)}>`,
				inline: true,
			},
			{
				name: "Channel amounts",
				value: `Text: \`${textChannelAmount}\`  |  Voice: \`${voiceChannelAmount}\`  |  Categories: \`${categoryAmount}\`  |  Total: \`${totalChannelAmount}\``,
				inline: true,
			},
			{
				name: "Server Timezone",
				value: `\`${server.timezone}\``,
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
				name: "Emoji Count",
				value: "`" + emojiCount + "`",
				inline: true,
			},
			{
				name: "Role Count",
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
				name: "Rules Channel",
				value: (interaction.guild.rulesChannel ?? "`None`").toString(),
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
			},
			{
				name: "Welcome Message",
				value: welcomeMessage,
				inline: true,
			},
			{
				name: "Leave Message",
				value: leaveMessage,
				inline: true,
			},
			{
				name: "Welcome DM",
				value: welcomeDM,
				inline: true,
			}
		)
		.setTimestamp();
	await interaction.editReply({ embeds: [infoEmbed] });
}

const replace = (msg: string, interaction, memberCount) =>
	msg
		.replace(/\{server\}/g, interaction.guild.name)
		.replace(/\{mention\}/g, interaction.user.toString())
		.replace(/\{ord_member_count\}/g, ordinal(memberCount))
		.replace(/\{member_count\}/g, memberCount.toLocaleString())
		.replace(/\{user\}/g, interaction.user.username)
		.replace(/\{user_tag\}/g, interaction.user.tag);
