import { CommandData } from "../../types";
import { MessageButton, MessageActionRow } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("market_buy")
	.setDescription("Buy items from a user's market")
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user to buy the item from")
			.setRequired(true)
	)
	.addStringOption((option) =>
		option
			.setName("item_name")
			.setDescription("The name of the item you want to buy")
			.setRequired(true)
	);

export async function run({
	interaction,
	profileOf,
	profile,
	updateProfile,
}: CommandData) {
	const user = interaction.options.getUser("user");
	const itemName = interaction.options.getString("item_name");
	const uprofile = await profileOf(user.id);
	const item = uprofile.market.find((m) => m.name === itemName);
	if (!item) {
		await interaction.reply({
			content: `${user.toString()} does not have that item! (remember capitalization)`,
			ephemeral: true,
		});
		return;
	}
	if (profile.mincoDollars < item.price) {
		await interaction.reply({
			content: `You don't have ${item.price} MD (the price of the item)`,
			ephemeral: true,
		});
		return;
	}
	const row = new MessageActionRow().addComponents(
		new MessageButton()
			.setCustomId("confirm")
			.setLabel("Confirm")
			.setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId("reject")
			.setLabel("Nevermind")
			.setStyle("DANGER")
	);
	const msg = await interaction.reply({
		content: `Confirm to buy ${item.name} for ${item.price} MD`,
		components: [row],
		fetchReply: true,
	});

	const filter = (i) =>
		(i.customId == "confirm" || i.customId == "reject") &&
		i.user.id === interaction.user.id;

	const collector = msg.createMessageComponentCollector({
		filter,
		time: 10000,
		max: 1,
	});
	let sendtimeout = true;
	collector.on("collect", async (i) => {
		sendtimeout = false;
		if (i.customId == "confirm") {
			await updateProfile({ $inc: { mincoDollars: -item.price } });
			await updateProfile({ $inc: { mincoDollars: item.price } }, user.id);
			user.send(`${i.user.toString()} bought your **${item.name}**`);
			await i.followUp(
				`You succesfully bought that item! ${user.toString()} will be DMed notifying your purchase.`
			);
		} else {
			await i.followUp("Request canceled");
		}
	});
	collector.on("end", async () => {
		if (sendtimeout)
			await interaction.followUp({ content: "Timed out!", ephemeral: true });
	});
}
