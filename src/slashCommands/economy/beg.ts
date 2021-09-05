import { CommandData } from "../../types";
import { randomInt } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("beg")
	.setDescription("Beg for Minco Dollars!");

export const cooldown = "3.5m";
export async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	console.log(profile.inventory);
	let response = "";
	let numberEcon = randomInt(1, 4);
	console.log(profile.inventory);
	if (profile.inventory.includes("05")) {
		if (profile.candyAmount <= 0) {
			await updateProfile({
				$pull: {
					inventorxy: "05",
				},
			});
		} else {
			await updateProfile({
				$inc: {
					candyAmount: -1,
				},
			});
			numberEcon *= 2;
			response += "You got a double bonus from your candy!\n";
		}
	}
	if (profile.spouse != null || profile.inventory.includes("07")) {
		let random = Math.floor(Math.random() * 100);
		const chance = profile.spouse != null ? 10 : 5;
		const mOrB = profile.spouse != null ? "for marriage" : "from your bear";
		if (random < chance) {
			numberEcon *= 2;
			response += `You got a double bonus ${mOrB}!\n`;
		}
	}
	await updateProfile({
		$inc: { mincoDollars: numberEcon },
	});
	let mdString = numberEcon == 1 ? "Dollar" : "Dollars";
	response += `You received ${numberEcon} Minco ${mdString}!`;
	await interaction.reply(response);
}
