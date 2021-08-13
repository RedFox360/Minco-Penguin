import { CommandData } from "../../types";
const vowels = ["a", "e", "i", "o", "u", "y"];

export const data = {
	name: "combine",
	description: "Combine 2 names",
	options: [
		{
			name: "name_1",
			description: "The first name",
			type: "STRING",
			required: true,
		},
		{
			name: "name_2",
			description: "The second name",
			type: "STRING",
			required: true,
		},
	],
};

export async function run({ interaction }: CommandData) {
	const n1 = interaction.options.getString("name_1");
	const n2 = interaction.options.getString("name_2");

	await interaction.reply(
		`${n1} + ${n2} = **${combineNames(n1, n2)}** or **${combineNames(n2, n1)}**`
	);
}

// note: this is copied from OwO Bot
function combineNames(name1: string, name2: string) {
	let count1 = -1;
	let count2 = -1;
	let mid1 = Math.ceil(name1.length / 2) - 1;
	let mid2 = Math.ceil(name2.length / 2) - 1;
	let noVowel1 = false,
		noVowel2 = false;
	for (let i = mid1; i >= 0; i--) {
		count1++;
		if (vowels.includes(name1.charAt(i).toLowerCase())) {
			i = -1;
		} else if (i == 0) {
			noVowel1 = true;
		}
	}
	for (let i = mid2; i < name2.length; i++) {
		count2++;
		if (vowels.includes(name2.charAt(i).toLowerCase())) {
			i = name2.length;
		} else if (i == name2.length - 1) {
			noVowel2 = true;
		}
	}

	let name = "";
	if (noVowel1 && noVowel2) {
		name = name1.substring(0, mid1 + 1);
		name += name2.substring(mid2);
	} else if (count1 <= count2) {
		name = name1.substring(0, mid1 - count1 + 1);
		name += name2.substring(mid2);
	} else {
		name = name1.substring(0, mid1 + 1);
		name += name2.substring(mid2 + count2);
	}
	return name;
}
