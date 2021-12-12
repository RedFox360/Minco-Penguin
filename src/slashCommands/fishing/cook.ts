import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";
import emojis from "../../functions/fishEmojis";

export const data = new SlashCommandBuilder()
	.setName("cook")
	.setDescription(
		"(Cooks 5 fish at a time) Cook your fish or egg for a fee of 10 MD"
	)
	.addStringOption((option) =>
		option
			.setName("item")
			.setDescription("The item to cook")
			.addChoice("Salmon", "salmon")
			.addChoice("Cod", "cod")
			.setRequired(true)
	);
export const cooldown = 20;

export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	const item = interaction.options.getString("item");
	if (profile.mincoDollars < 10) {
		await interaction.reply({
			content: "Cooking your item requires a 10 md fee",
			ephemeral: true,
		});
	}
	await updateProfile({ $inc: { mincoDollars: -10 } });
	if (item === "salmon") {
		if (profile.fish.salmons == 0) {
			await interaction.reply({
				content: "You don't have any salmon to cook!",
				ephemeral: true,
			});
		}
		const cookAmount = profile.fish.salmons > 5 ? 5 : profile.fish.salmons;
		await interaction.reply("Cooking items...");
		setTimeout(async () => {
			await updateProfile({
				$inc: {
					"fish.salmons": -cookAmount,
					"fish.cookedSalmons": cookAmount,
				},
			});
			await interaction.editReply({
				content: `${emojis.cookedSalmon} You cooked ${cookAmount} delicious salmon!`,
			});
		}, 5000);
	} else {
		if (profile.fish.cods == 0) {
			await interaction.reply({
				content: "You don't have any cod to cook!",
				ephemeral: true,
			});
		}
		const cookAmount = profile.fish.cods > 5 ? 5 : profile.fish.cods;
		await interaction.reply("Cooking items...");
		setTimeout(async () => {
			await updateProfile({
				$inc: {
					"fish.cods": -cookAmount,
					"fish.cookedCods": cookAmount,
				},
			});
			await interaction.editReply({
				content: `${emojis.cookedCod} You cooked ${cookAmount} delicious cod!`,
			});
		}, 5000);
	}
}
