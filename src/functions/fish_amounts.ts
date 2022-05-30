import { randomInt } from 'mathjs';
import { Biome, FishJSON, RodType, RodJSON } from '../types';
import fishJSON from '../json/fish.json';
import _rodInfo from '../json/rod_info.json';
import { Collection } from 'discord.js';
import fishEmojis from '../functions/fish_emojis';
const rodInfo = _rodInfo as RodJSON;
/*
	STRUCTURING:
	Get the fish amounts from the fish.json file based on a rod
	Rods get better in this order: 'wooden', 'upgraded', 'metal', 'heavy', 'polished', 'quartz', 'ruby', 'sapphire', 'diamond', 'emerald'
	Benefits of each rod
	wooden: normal rod
	upgraded: catch more fish
	metal: catch less fish but get rarer fish
	heavy: catch more fish on average
	polished: get more rare fish
	quartz: get more all fish
	ruby: get more rare and all fish
	sapphire: get more rare and all fish
	diamond: get more of all fish
	emerald: get more of all fish
	For the wooden rod, the chances are based off the default chance in the JSON file (fish). The amount of fish caught (if the chance is succesful) will vary between 30% and 100% (ceiled values) of the max chance.
	For each rod where more fish is caught, increment the max amount by +20%. For each rod where more rare fish is caught, increment the CHANCE for fish with a rarity more than 2 by +33%.
*/
export default function getFishAmount(rod: RodType, biome: Biome) {
	const { rarityChanceIncrease, maxAmountIncrease } = rodInfo.find(
		a => a.name === rod
	);
	const toReturn: {
		[fish: string]: {
			fishAmount: number;
			emoji: string;
			singular: string;
			plural: string;
		};
	} = {};
	const fishes = new Collection(
		Object.entries(Object.assign({}, fishJSON as FishJSON))
	);
	fishes
		.filter(fish => fish.biomes.includes(biome))
		.map((fish, fishName) => {
			let newMaxAmount: number, newDefaultChance: number;
			if (fish.rarity > 2) {
				newDefaultChance =
					fish.defaultChance * (1 + rarityChanceIncrease);
			} else {
				newMaxAmount =
					fish.maxAmount * (1 + maxAmountIncrease);
			}

			return {
				biomes: fish.biomes,
				rarity: fish.rarity,
				maxAmount: newMaxAmount ?? fish.maxAmount,
				defaultChance: newDefaultChance ?? fish.defaultChance,
				formattedNames: fish.formattedNames,
				name: fishName
			};
		})
		.filter(fish => {
			return dPercentage(fish.defaultChance);
		})
		.forEach(fish => {
			toReturn[fish.name] = {
				fishAmount: randomInt(
					Math.ceil(fish.maxAmount * 0.3),
					fish.maxAmount
				),
				emoji: fishEmojis[fish.name],
				singular: fish.formattedNames[0],
				plural: fish.formattedNames[1]
			};
		});
	return toReturn;
}

// return a boolean based on a percentage as a number between 0 and 1
// for example, if the number 0.9 is passed in the function will return "true" 90% of the time and "false" 10% of the time
function dPercentage(percentage: number): boolean {
	return Math.random() < percentage;
}
