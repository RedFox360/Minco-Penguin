import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandData } from "../../types";
import {
	MessageEmbed,
	MessageButton,
	MessageActionRow,
	MessageComponentInteraction,
} from "discord.js";
import ms from "ms";

export const data = new SlashCommandBuilder()
	.setName("propose")
	.setDescription("Propose to a member of the server")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to propose to")
			.setRequired(true)
	);
export const cooldown = "1h";
export async function run({
	interaction,
	profile,
	updateProfile,
	profileOf,
}: CommandData) {
	if (profile.spouse) {
		await interaction.reply({
			content:
				"You are already married! You can divorce your current spouse by using /divorce to marry a new user",
			ephemeral: true,
		});
		return;
	}
	if (!profile.inventory.includes("01")) {
		await interaction.reply({
			content:
				":ring: You don't have a marriage ring! You can buy a marriage ring using the /buy command",
			ephemeral: true,
		});
		return;
	}
	const user = interaction.options.getUser("user");
	const userId = user.id;
	const { spouse: userSpouse } = await profileOf(userId);
	const interactionUserId = interaction.user.id;
	if (userId === interactionUserId) {
		await interaction.reply({
			content: "You can't marry yourself!",
			ephemeral: true,
		});
		return;
	}
	if (user.bot) {
		await interaction.reply({
			content: "You can't marry a bot!",
			ephemeral: true,
		});
		return;
	}
	if (userSpouse) {
		await interaction.reply({
			content: `${user.toString()} is already married!`,
			ephemeral: true,
		});
		return;
	}
	const acceptButton = new MessageButton()
		.setCustomId("accept_proposal")
		.setLabel("Accept Proposal")
		.setEmoji("💍")
		.setStyle("SUCCESS");
	const filter = (i) =>
		i.user.id === userId && i.customId === "accept_proposal";
	let row = new MessageActionRow().addComponents(acceptButton);
	const proposal = new MessageEmbed()
		.setColor("#85C1E9") // light blue
		.setAuthor("Proposal", interaction.user.avatarURL({ dynamic: true }))
		.setDescription(
			`**${user.toString()}, ${interaction.user.toString()} has proposed to you**. Click the "Accept Proposal" button to marry ${interaction.user.toString()}. The button will not work after 3 hours.
		
Benefits of marriage:
\`\`\`md
1. Chance of doubling beg
2. Higher amount of money from math
3. Higher amount of money from /daily and /weekly
\`\`\``
		)
		.setFooter(
			"Don't feel like marrying someone? /buy a bear to get similar rewards!"
		);
	const msg = await interaction.reply({
		embeds: [proposal],
		components: [row],
		fetchReply: true,
	});
	const collector = msg.createMessageComponentCollector({
		filter,
		time: ms("3h"),
	});
	collector.on("collect", async (i: MessageComponentInteraction) => {
		if (!i.isMessageComponent()) return;
		await updateProfile({ spouse: userId }, interactionUserId);
		await updateProfile({ spouse: interactionUserId }, userId);
		await i.reply(
			`:bouquet: <@${userId}> and <@${interactionUserId}> are now married!`
		);
		acceptButton.setDisabled(true);
		row = new MessageActionRow().addComponents(acceptButton);
		await i.update({ embeds: [proposal], components: [row] });
	});
}
