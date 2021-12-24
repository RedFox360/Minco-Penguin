import { CommandData } from "../../types";
import {
	SlashCommandBuilder,
	SlashCommandIntegerOption,
} from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

// perfect nums below 2^53
const perfectNums = [6, 28, 496, 8128, 33550336, 8589869056, 137438691328];
const pi = new MessageEmbed()
	.setColor("#f0b27a")
	.setTitle("Pi π")
	.setDescription(
		"3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912..."
	);
const e = new MessageEmbed()
	.setColor("#85c1e9")
	.setTitle("Euler's Number")
	.setDescription(
		"2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011573834187930702154089149934884167509244761460668082264800168477411853742345442437107539077744992069551702761838606261331384583000752044933826560297606737113200709328709127443747047230696977209310141692836819025515108657463772111252389784425056953696770785449969967946864454905987931636889230098793..."
	);
const tau = new MessageEmbed()
	.setColor("#76d7c4")
	.setTitle("Tau τ")
	.setDescription(
		"6.283185307179586476925286766559005768394338798750211641949889184615632812572417997256069650684234135964296173026564613294187689219101164463450718816256962234900568205403877042211119289245897909860763928857621951331866892256951296467573566330542403818291297133846920697220908653296426787214520498282547449174013212631176349763041841925658508183430728735785180720022661061097640933042768293903883023218866114540731519183906184372234763865223586210237096148924759925499134703771505449782455876366023898..."
	);
const phi = new MessageEmbed()
	.setColor("#f7dc6f")
	.setTitle("Phi Φ")
	.setDescription(
		"1.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389086595939582905638322661319928290267880675208766892501711696207032221043216269548626296313614438149758701220340805887954454749246185695364864449241044320771344947049565846788509874339442212544877066478091588460749988712400765217057517978834166256249407589069704000281210427621771117778053153171410117046665991466979873176135600670874807..."
	);
const root2 = new MessageEmbed()
	.setColor("#d35400")
	.setTitle("Square Root of 2")
	.setDescription(
		"1.414213562373095048801688724209698078569671875376948073176679737990732478462107038850387534327641572735013846230912297024924836055850737212644121497099935831413222665927505592755799950501152782060571470109559971605970274534596862014728517418640889198609552329230484308714321450839762603627995251407989687253396546331808829640620615258352395054745750287759961729835575220337531857011354374603408498847160386899970699004815030544027790316454247823068492936918621580578463111596668713013015618568987237..."
	);
const numberOption = (option: SlashCommandIntegerOption) =>
	option
		.setName("number")
		.setDescription("The number to check")
		.setRequired(true);
export const data = new SlashCommandBuilder()
	.setName("number")
	.setDescription("Number functions")
	.addSubcommand((subcommand) =>
		subcommand
			.setName("prime")
			.setDescription("Checks if a number is prime")
			.addIntegerOption(numberOption)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("square")
			.setDescription("Checks if a number is a perfect square")
			.addIntegerOption(numberOption)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("perfect")
			.setDescription(
				"Checks if the sum of the number's factors excluding itself equal the number"
			)
			.addIntegerOption(numberOption)
	)
	.addSubcommand((subcommand) =>
		subcommand
			.setName("constant")
			.setDescription(
				"Sends some irrational constants; e.g. pi, tau, root 2, etc."
			)
			.addStringOption((option) =>
				option
					.setName("name")
					.setDescription("The name of the constant")
					.addChoice("Pi π", "pi")
					.addChoice("Tau τ", "tau")
					.addChoice("Phi Φ", "phi")
					.addChoice("Square Root of 2", "root_2")
					.addChoice("e (Euler's number)", "e")
					.setRequired(true)
			)
	);

export async function run({ interaction }: CommandData) {
	const subcommand = interaction.options.getSubcommand();
	if (subcommand === "constant") {
		switch (interaction.options.getString("name")) {
			case "pi": {
				await interaction.reply({ embeds: [pi] });
				return;
			}
			case "tau": {
				await interaction.reply({ embeds: [tau] });
				return;
			}
			case "phi": {
				await interaction.reply({ embeds: [phi] });
				return;
			}
			case "root_2": {
				await interaction.reply({ embeds: [root2] });
				return;
			}
			case "e": {
				await interaction.reply({ embeds: [e] });
				return;
			}
		}
	} else {
		const num = interaction.options.getInteger("number");
		if (num <= 0) {
			await interaction.reply({
				content: "Please enter a number **≥1**",
				ephemeral: true,
			});
			return;
		}
		await interaction.deferReply();
		switch (interaction.options.getSubcommand()) {
			case "prime": {
				await interaction.editReply(isPrime(num));
				return;
			}
			case "square": {
				await interaction.editReply(isSquare(num));
				return;
			}
			case "perfect": {
				await interaction.editReply(isPerfect(num));
				return;
			}
		}
	}
}

function isPrime(num: number) {
	if (num == 1) return "1 is neither prime nor composite";
	if (num == 2) return `2 **is prime**`;
	for (let i = 2; i <= Math.ceil(Math.sqrt(num)); i++) {
		if (num % i == 0)
			return `${num.toLocaleString()} **isn't** prime because it is divisible by ${i}`;
	}
	return `${num.toLocaleString()} **is prime**`;
}

function isSquare(num: number) {
	const sqrt = Math.sqrt(num);
	const formatSqrt = sqrt.toLocaleString();
	const formatNum = num.toLocaleString();
	if (Math.floor(sqrt) === sqrt) {
		return `${formatNum} is a perfect square (\`${formatSqrt} \* ${formatSqrt} = ${formatNum}\`)`;
	} else {
		return `${formatNum} **is not** a perfect square`;
	}
}

// this function checks if the number is in a specific list of perfect numbers because the amount of perfect numbers below 2^53 is very low (only 7)
function isPerfect(num: number) {
	const formatNum = num.toLocaleString();
	if (perfectNums.includes(num)) {
		return `${formatNum} **is perfect**`;
	} else {
		return `${formatNum} **is not** perfect`;
	}
}
