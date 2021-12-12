import { CommandData } from "../../types";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import ordinal from "ordinal";

export function subcommand() {
	return new SlashCommandSubcommandBuilder()
		.setName("announce_message")
		.setDescription(
			"Set the announcement message for your server (type default to revert to normal)"
		)
		.addStringOption((option) =>
			option
				.setName("message_type")
				.setDescription("The type of message")
				.setRequired(true)
				.addChoice("User joined", "join")
				.addChoice("User left", "leave")
				.addChoice("DM on join", "dm")
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message you want to send")
				.setRequired(true)
		);
}

export async function run({ interaction, server, updateServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	if (!interaction.member.permissions.has("MANAGE_GUILD")) {
		await interaction.reply({
			content:
				"You need the `Manage Server` permission to execute this command",
			ephemeral: true,
		});
		return;
	}
	let msg = interaction.options.getString("message");
	let dm = false;
	switch (interaction.options.getString("message_type")) {
		case "join": {
			if (msg == "default")
				msg =
					"Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!";
			await updateServer({ welcomeMessage: msg });
			break;
		}
		case "leave": {
			if (msg == "default")
				msg =
					"It seems {user_tag} has left us. We now have {member_count} members.";
			await updateServer({ leaveMessage: msg });
			break;
		}
		case "dm": {
			if (msg == "default") {
				msg = undefined;
				dm = true;
			}
			await updateServer({ welcomeDM: msg });
			break;
		}
	}
	if (dm) {
		await interaction.reply("DM message turned off");
		return;
	}
	const memberCount = server.memberCount;
	const memberCountOrdinal = ordinal(memberCount);
	await interaction.reply(
		"Message updated, example:\n" +
			msg
				.replace(/\{server\}/g, interaction.guild.name)
				.replace(/\{mention\}/g, interaction.user.toString())
				.replace(/\{ord_member_count\}/g, memberCountOrdinal)
				.replace(/\{member_count\}/g, memberCount.toLocaleString())
				.replace(/\{user\}/g, interaction.user.username)
				.replace(/\{user_tag\}/g, interaction.user.tag)
	);
	setTimeout(async () => {
		await interaction.followUp({
			content: `Tips: (these texts will be converted to data)
**{server}** = the server name
**{mention}** = mention the user who joined
**{member_count}** = the new server member count
**{ord_member_count}** = ordinal member count
**{user}** = the username of the user who joined
**{user_tag}** = the username including tag`,
			ephemeral: true,
		});
	}, 1000);
}
