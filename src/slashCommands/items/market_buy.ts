import { CommandData } from "../../types";
import { MessageButton, MessageActionRow } from "discord.js";

export const data = {
	name: "market_buy",
	description: "Buy items from a user's market",
	options: [
		{
			name: "user",
			description: "The user to buy the item from",
			type: "USER",
			required: true,
		},
		{
			name: "item_name",
			description: "The name of the item you want to buy",
			type: "STRING",
			required: true,
		},
	],
};

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
			user.send(`${interaction.user.toString()} bought your **${item.name}**`);
			await interaction.followUp(
				`You succesfully bought that item! ${user.toString()} will be DMed notifying your purchase.`
			);
		} else {
			await interaction.followUp("Request canceled");
		}
	});
	collector.on("end", async () => {
		if (sendtimeout)
			await interaction.followUp({ content: "Timed out!", ephemeral: true });
	});
}
