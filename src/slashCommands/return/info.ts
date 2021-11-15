import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import ordinal from "ordinal";

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
			console.table({
				createdTimestamp: user.createdTimestamp,
				joinedAt: member.joinedTimestamp,
			});
			const infoEmbed = new MessageEmbed()
				.setAuthor(
					user.tag,
					user.avatarURL({ dynamic: true }),
					user.avatarURL({ dynamic: true })
				)
				.setColor(member.roles.highest.color || "GREYPLE") // darkish green
				.addFields(
					{
						name: "Created at",
						value: `<t:${Math.floor(user.createdTimestamp / 1000)}:f>`,
						inline: true,
					},
					{
						name: "Joined at",
						value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:f>`,
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
					interaction.guild.iconURL(),
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
						value: `<t:${Math.floor(
							interaction.guild.createdTimestamp / 1000
						)}>`,
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
				.setFooter(`Server ID: ${interaction.guild.id}`);
			await interaction.editReply({ embeds: [infoEmbed] });
			break;
		}
	}
}

const replace = (msg: string, interaction, memberCount) =>
	msg
		.replace(/\{server\}/g, interaction.guild.name)
		.replace(/\{mention\}/g, interaction.user.toString())
		.replace(/\{ord_member_count\}/g, ordinal(memberCount))
		.replace(/\{member_count\}/g, memberCount.toLocaleString())
		.replace(/\{user\}/g, interaction.user.username)
		.replace(/\{user_tag\}/g, interaction.user.tag);
