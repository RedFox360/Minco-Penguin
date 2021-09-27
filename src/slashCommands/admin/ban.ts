import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import prettyMilliseconds from "pretty-ms";

export const data = new SlashCommandBuilder()
	.setName("ban")
	.setDescription("MOD: ban a user")
	.addUserOption((option) =>
		option.setName("user").setDescription("The user to ban").setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("reason")
			.setDescription("Why you want to ban that user")
			.setRequired(false)
	)
	.addStringOption((option) =>
		option
			.setName("time")
			.setDescription("The time to ban that user")
			.setRequired(false)
	);

export const permissions = ["BAN_MEMBERS"];

export async function run({ interaction, updateProfileInServer }: CommandData) {
	if (!interaction.guild) {
		await interaction.reply({
			content: "This command can only be used in a server",
			ephemeral: true,
		});
		return;
	}
	const user = interaction.options.getUser("user");
	const member = await interaction.guild.members.fetch(user);
	const reason = interaction.options.getString("reason");
	const time = interaction.options.getString("time");
	if (time && !ms(time)) {
		await interaction.reply({
			content: "You wrote an invalid time",
			ephemeral: true,
		});
		return;
	}
	const reasonFormat = reason ? `*${reason}*` : "No reason provided";
	const timeFormat = time ? prettyMilliseconds(ms(time)) : "Indefinite";
	const addInfraction = {
		reason,
		infractionType: "Ban",
		time: undefined,
		date: Date.now(),
	};
	if (time) addInfraction.time = ms(time);
	updateProfileInServer(
		{
			$push: {
				infractions: addInfraction,
			},
		},
		user.id
	);
	const banEmbed = new MessageEmbed()
		.setColor("#E48383")
		.setTitle("Banned")
		.setDescription(
			`${user.toString()} has been banned\nReason: ${reasonFormat}`
		)
		.setFooter(interaction.guild.name)
		.setAuthor(user.username, user.avatarURL());
	if (reason) await member.ban({ reason });
	else await member.ban();
	await interaction.reply({ embeds: [banEmbed] });
	try {
		await user.send(`You were banned from ${interaction.guild.name}
Time: ${timeFormat}
Reason: ${reasonFormat}`);
	} catch (err) {}
	if (time) {
		setTimeout(async () => {
			await interaction.guild.members.unban(user);
			try {
				await user.send(`You were unbanned in ${interaction.guild.name}`);
			} catch (err) {}
		});
	}
}
