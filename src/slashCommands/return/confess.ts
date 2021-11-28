import { SlashCommandBuilder } from "@discordjs/builders";
import {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageComponentInteraction,
} from "discord.js";
import ms from "ms";
import { CommandData } from "../../types";

export const data = new SlashCommandBuilder()
	.setName("confess")
	.setDescription("Submit a confession anonymously")
	.addStringOption((option) =>
		option
			.setName("confession")
			.setDescription("Your confession")
			.setRequired(true)
	)
	.addChannelOption((option) =>
		option
			.setName("channel")
			.setDescription("A channel to send your confession to")
			.setRequired(false)
	);

export async function run({ interaction, profileInServer }: CommandData) {
	if (
		profileInServer.bannedFromConfessions &&
		!interaction.member.permissions.has("MANAGE_MESSAGES") &&
		interaction.user.id !== "724786310711214118"
	) {
		await interaction.reply({
			content: "You were banned from sending confessions by a server manager",
			ephemeral: true,
		});
		return;
	}

	const confession = interaction.options.getString("confession");
	const channel =
		interaction.options.getChannel("channel") ?? interaction.channel;

	if (!channel.isText()) {
		await interaction.reply({
			content: "That channel is invalid",
			ephemeral: true,
		});
		return;
	}

	const embed = new MessageEmbed()
		.setTitle("Anonymous Confession")
		.setDescription(`"${confession}"`)
		.setTimestamp()
		.setColor("RANDOM");

	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("delete")
			.setLabel("Delete")
			.setStyle("DANGER")
			.setEmoji("💥"),
		new MessageButton()
			.setCustomId("reveal")
			.setLabel("Reveal")
			.setStyle("PRIMARY")
			.setEmoji("🙂")
	);
	await interaction.reply({
		content: `Confession sent to <#${channel.id}>`,
		ephemeral: true,
	});
	const msg = await interaction.channel.send({
		embeds: [embed],
		components: [row],
	});
	const filter = (i) =>
		i.user.id === interaction.user.id &&
		(i.customId === "delete" || i.customId === "reveal");
	const collector = msg.createMessageComponentCollector({
		filter,
		time: ms("1.5m"),
	});
	let deleted = false;
	collector.on("collect", async (i: MessageComponentInteraction) => {
		if (!i.isMessageComponent()) return;
		switch (i.customId) {
			case "delete": {
				await msg.delete();
				deleted = true;
				break;
			}
			case "reveal": {
				embed.setTitle("Confession");
				await msg.edit({
					embeds: [embed],
					components: [row],
					content: interaction.user.toString(),
				});
				break;
			}
		}
	});
	collector.on("end", async () => {
		if (!deleted) await msg.edit({ embeds: [embed], components: [] });
	});
}
