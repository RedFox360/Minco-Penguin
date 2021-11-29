import { CommandData } from "../../types";
import { randomInt } from "mathjs";
import { SlashCommandBuilder } from "@discordjs/builders";
import gems from "../../json/gems.json";

export const data = new SlashCommandBuilder()
	.setName("use")
	.setDescription("Use your items!")
	.addStringOption((option) =>
		option
			.setName("item")
			.setDescription("The item to use")
			.setRequired(true)
			.addChoice("Lootbox", "lootbox")
			.addChoice("Tomato", "tomato")
			.addChoice("Egg", "egg")
			.addChoice("Banana", "banana")
	);

export const cooldown = 12;
export async function run(data: CommandData) {
	const { interaction } = data;
	const item = interaction.options.getString("item");
	if (item == "lootbox") {
		lootbox(data);
	} else if (item == "tomato") {
		tomato(data);
	} else if (item == "egg") {
		egg(data);
	} else if (item == "banana") {
		banana(data);
	}
}
async function tomato({
	interaction,
	profile: { inventory },
	updateProfile,
}: CommandData) {
	if (!inventory.includes("04")) {
		await interaction.reply({
			content: "You don't have a tomato!",
			ephemeral: true,
		});
		return;
	}
	if (randomInt(0, 900) == 0) {
		interaction.reply(
			"The Minco dice have decided you will win **100** Minco Dollars!"
		);
		await updateProfile({
			$inc: { mincoDollars: 100 },
			$pull: { inventory: "04" },
		});
		return;
	}
	let randnum = randomInt(2, 6);
	await updateProfile({
		$inc: { mincoDollars: randnum },
		$pull: { inventory: "04" },
	});
	interaction.reply(
		`You ate your fresh tomato and won ${randnum} Minco Dollars!`
	);
}
async function lootbox({ interaction, profile, updateProfile }: CommandData) {
	let replied = false;
	if (!profile.inventory.includes("10")) {
		await interaction.reply({
			content: "You don't have a lootbox!",
			ephemeral: true,
		});
		return;
	}
	const mincoAmount = randomInt(35, 65);
	await updateProfile({
		$inc: { mincoDollars: mincoAmount },
		$pull: { inventory: "10" },
	});
	if (Math.floor(Math.random() * 20) == 0) {
		const g = gems[0];
		let gem = g[Math.floor(Math.random() * g.length)];

		if (!profile.gems.includes(gem as string)) {
			let gemName: string;
			for (let { number, name } of gems[1] as any) {
				if (gem == number) {
					gemName = name;
					break;
				}
			}
			await updateProfile({ $push: { gems: gem } });

			await interaction.reply(`You won a ${gemName}!`);
			replied = true;
		}
	}
	if (Math.floor(Math.random() * 4) == 0 && !profile.inventory.includes("05")) {
		await updateProfile({
			$push: {
				inventory: "05",
			},
			candyAmount: 3,
		});
		if (!replied) {
			await interaction.reply("You won a Candy :candy:!");
			replied = true;
		} else {
			await interaction.followUp("You won a Candy :candy:!");
		}
	}
	if (!replied) {
		await interaction.reply(`You won ${mincoAmount} Minco Dollars!`);
	} else {
		await interaction.followUp(`You won ${mincoAmount} Minco Dollars!`);
	}
}
async function egg({
	interaction,
	profile: { inventory },
	updateProfile,
}: CommandData) {
	if (!inventory.some((v) => v.startsWith("11"))) {
		await interaction.reply({
			content: "You don't have an egg!",
			ephemeral: true,
		});
		return;
	}
	const eggValue = inventory.find((value) => value.startsWith("11"));
	let numberEcon: number;
	if (eggValue == "11") {
		numberEcon = randomInt(5, 9);
	} else if (eggValue == "11-0") {
		// boiled egg
		numberEcon = randomInt(12, 17);
	} else if (eggValue == "11-1") {
		// scrambled egg
		numberEcon = randomInt(13, 18);
	} else if (eggValue == "11-2") {
		// omelette
		numberEcon = randomInt(14, 20);
	}
	await updateProfile({
		$inc: {
			mincoDollars: numberEcon,
		},
		$pull: {
			inventory: eggValue,
		},
	});
	const eggName = (() => {
		if (eggValue == "11") return "Raw Egg";
		if (eggValue == "11-0") return "Boiled Egg";
		if (eggValue == "11-1") return "Scrambled Egg";
		if (eggValue == "11-2") return "Omelette";
	})();
	await interaction.reply(
		`You ate your ${eggName} and won ${numberEcon} Minco Dollars!`
	);
}

async function banana({
	interaction,
	profile: { inventory },
	updateProfile,
}: CommandData) {
	if (!inventory.includes("12")) {
		await interaction.reply({
			content: "You don't have a banana!",
			ephemeral: true,
		});
		return;
	}
	const randnum = randomInt(5, 16); // 5-15 (average: 10 - price of banana)
	await updateProfile({
		$inc: { mincoDollars: randnum },
		$pull: { inventory: "12" },
	});
	await interaction.reply(
		`You ate your banana and won ${randnum} Minco Dollars!`
	);
}
