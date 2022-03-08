import { CommandData, Profile } from "../../types";
import { randomInt } from "mathjs";
import emojis from "../fishEmojis";

export default async function run({
	interaction,
	profile,
	updateProfile,
}: CommandData) {
	if (!profile.fish) {
		await interaction.reply({
			content: "You don't have any fish!",
			ephemeral: true,
		});
	}
	const amountOption = interaction.options.getInteger("amount");
	if (amountOption && amountOption < 1) {
		await interaction.reply({
			content: "Your fish amount must be a positive number",
			ephemeral: true,
		});
	}
	switch (interaction.options.getString("fish_name")) {
		case "salmon_cooked": {
			try {
				const amount = amountOption ?? profile.fish.cookedSalmons;
				const addPrice = await sellCookedSalmon(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.cookedSalmon} You sold ${amount} cooked salmon for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "cod_cooked": {
			try {
				const amount = amountOption ?? profile.fish.cookedCods;
				const addPrice = await sellCookedCod(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.cookedCod} You sold ${amount} cooked cod for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "salmon": {
			try {
				const amount = amountOption ?? profile.fish.salmons;
				const addPrice = await sellSalmon(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.salmon} You sold ${amount} salmon for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "cod": {
			try {
				const amount = amountOption ?? profile.fish.cods;
				const addPrice = await sellCod(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.cod} You sold ${amount} cod for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "clownfish": {
			try {
				const amount = amountOption ?? profile.fish.clownfish;
				const addPrice = await sellClownfish(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.clownfish} You sold ${amount} clownfish for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "pufferfish": {
			try {
				const amount = amountOption ?? profile.fish.pufferfish;
				const addPrice = await sellPufferfish(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.pufferfish} You sold ${amount} pufferfish for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
		case "axolotl": {
			try {
				const amount = amountOption ?? profile.fish.axolotls;
				const addPrice = await sellAxolotl(profile, amount, updateProfile);
				await interaction.reply(
					`${emojis.axolotl} You sold ${amount} axolotl(s) for ${addPrice} MD!`
				);
			} catch (e) {
				await interaction.reply({
					content: "You don't have that many fish!",
					ephemeral: true,
				});
			}
			break;
		}
	}
}
async function sellSalmon(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.salmons) {
		throw new Error("amount too high");
	}
	const price = randomInt(3, 6);
	const addPrice = price * amount;
	if (profile.fish.salmons != 0) {
		await updateProfile({ $inc: { "fish.salmons": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
}
async function sellCod(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.cods) {
		throw new Error("amount too high");
	}
	const price = randomInt(2, 6);
	const addPrice = price * amount;
	if (profile.fish.cods != 0) {
		await updateProfile({ $inc: { "fish.cods": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
}
async function sellCookedSalmon(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.cookedSalmons) {
		throw new Error("amount too high");
	}
	const price = randomInt(2, 9);
	const addPrice = price * amount;
	if (profile.fish.cookedSalmons != 0) {
		await updateProfile({ $inc: { "fish.cookedSalmons": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
}
async function sellCookedCod(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.cookedCods) {
		throw new Error("amount too high");
	}
	const price = randomInt(1, 9);
	const addPrice = price * amount;
	if (profile.fish.cookedCods != 0) {
		await updateProfile({ $inc: { "fish.cookedCods": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
}
async function sellPufferfish(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.pufferfish) {
		throw new Error("amount too high");
	}
	const price = randomInt(10, 20);
	const addPrice = price * amount;
	if (profile.fish.pufferfish != 0) {
		await updateProfile({ $inc: { "fish.pufferfish": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
	return;
}
async function sellClownfish(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.clownfish) {
		throw new Error("amount too high");
	}
	const price = randomInt(5, 10);
	const addPrice = price * amount;
	if (profile.fish.clownfish != 0) {
		await updateProfile({ $inc: { "fish.clownfish": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
	return;
}
async function sellAxolotl(
	profile: Profile,
	amount: number,
	updateProfile: (a) => Promise<Profile>
) {
	if (amount > profile.fish.axolotls) {
		throw new Error("amount too high");
	}
	const price = randomInt(85, 105);
	const addPrice = price * amount;
	if (profile.fish.axolotls != 0) {
		await updateProfile({ $inc: { "fish.axolotls": -amount } });
		await updateProfile({ $inc: { mincoDollars: addPrice } });
		return addPrice;
	}
	return;
}
