import { SlashCommand } from '../../types';
const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

const combine = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('combine')
			.setDescription('Combine 2 names')
			.addStringOption(option =>
				option
					.setName('name_1')
					.setDescription('The first name')
					.setRequired(true)
			)
			.addStringOption(option =>
				option
					.setName('name_2')
					.setDescription('The second name')
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const n1 = interaction.options.getString('name_1');
		const n2 = interaction.options.getString('name_2');
		const combineNamesOption1 = combineNames(n1, n2);
		const combineNamesOption2 = combineNames(n2, n1);
		const content = `${n1} + ${n2} = **${combineNamesOption1}** or **${combineNamesOption2}**`;
		await interaction.reply(content);
	});

// taken from ChristopherBThai's OwO bot (Copyright)
// LICENSE: https://github.com/ChristopherBThai/Discord-OwO-Bot/blob/master/LICENSE
function combineNames(name1: string, name2: string) {
	let count1 = -1;
	let count2 = -1;
	const mid1 = Math.ceil(name1.length / 2) - 1;
	const mid2 = Math.ceil(name2.length / 2) - 1;
	let noVowel1 = false,
		noVowel2 = false;
	for (let i = mid1; i >= 0; i--) {
		count1++;
		if (vowels.includes(name1.charAt(i).toLowerCase())) {
			i = -1;
		} else if (i === 0) {
			noVowel1 = true;
		}
	}
	for (let i = mid2; i < name2.length; i++) {
		count2++;
		if (vowels.includes(name2.charAt(i).toLowerCase())) {
			i = name2.length;
		} else if (i === name2.length - 1) {
			noVowel2 = true;
		}
	}

	let name = '';
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

export default combine;
