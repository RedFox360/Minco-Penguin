import { CommandData } from "../../types";
import prettyMs from "pretty-ms";
import { MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("Ping the bot");

export async function run({ interaction }: CommandData) {
	await interaction.deferReply();
	const latency = Math.round(interaction.client.ws.ping);
	const ping = Date.now() - interaction.createdTimestamp;
	const [status, color] = (() => {
		if (ping <= 500) return ["online", "#48C9B0"];
		else if (ping <= 2000) return ["slightly lagging", "#F7DC6F"];
		else if (ping <= 7000) return ["lagging", "FF9433"];
		else return ["severely lagging", "#E74C3C"];
	})();

	const pingEmbed = new MessageEmbed()
		.setColor(color as any)
		.setTitle(":robot: Pong!")
		.setAuthor(
			interaction.member?.displayName ?? interaction.user.username,
			interaction.user.avatarURL()
		)
		.addFields(
			{ name: "Status:", value: status },
			{
				name: "Execution Time",
				value: prettyMs(ping),
			},
			{ name: "Client Latency", value: prettyMs(latency) },
			{ name: "Client Uptime", value: prettyMs(interaction.client.uptime) }
		)
		.setTimestamp()
		.setFooter(interaction.guild?.name ?? interaction.user.username);

	interaction.editReply({ embeds: [pingEmbed] });
}
