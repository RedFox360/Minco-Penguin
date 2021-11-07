import { CommandData } from "../../types";
import { randomInt } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export const data = new SlashCommandBuilder()
	.setName("beg")
	.setDescription("Beg for Minco Dollars!");

export const cooldown = "6.5m";
export async function run({
	interaction,
	profile,
	server,
	updateProfile,
}: CommandData) {
	const dayOfTheWeek = dayjs().tz(server.timezone).day();
	let response = "";
	let numberEcon = randomInt(4, 8);
	if (
		profile.birthday &&
		dayjs(profile.birthday).format("M D") === dayjs().format("M D")
	) {
		if (Math.floor(Math.random() * 4) != 1) {
			numberEcon *= 2;
			response += "You got your birthday double bonus!\n";
		}
	}
	if (profile.inventory.includes("05")) {
		if (profile.candyAmount <= 0) {
			await updateProfile({
				$pull: {
					inventory: "05",
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
	if (Math.round(Math.random()) && dayOfTheWeek === 5) {
		numberEcon *= 2;
		response += "You got the Friday double bonus!\n";
	} else if (
		Math.floor(Math.random() * 4) === 1 &&
		(dayOfTheWeek === 0 || dayOfTheWeek === 6)
	) {
		numberEcon *= 2;
		response += "You got the weekend double bonus!\n";
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
