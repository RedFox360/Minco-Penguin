import { EmbedBuilder } from 'discord.js';

const sieveLimit = 65_536;
const sieveLimitSquared = 65_536 * 65_536;
const sieve = eratosthenes(sieveLimit);
const perfectNums = [
	6, 28, 496, 8128, 33_550_336, 8_589_869_056, 137_438_691_328
];

export function isPrime(num: number, locale: string) {
	if (num === 1) return '1 is neither prime nor composite';
	if (num === 2) return `2 **is prime**`;
	if (num % 2 === 0)
		return `${num.toLocaleString(
			locale
		)} **isn't** prime because it is divisible by 2`;
	if (num < sieveLimitSquared) {
		for (const primeNum of sieve) {
			if (primeNum >= num) break;
			if (num % primeNum === 0) {
				return `${num.toLocaleString(
					locale
				)} **isn't** prime because it is divisible by ${primeNum}`;
			}
		}
		return `${num.toLocaleString(locale)} **is prime**`;
	}
	for (let i = 3; i <= Math.ceil(Math.sqrt(num)); i += 2) {
		if (num % i === 0)
			return `${num.toLocaleString(
				locale
			)} **isn't** prime because it is divisible by ${i}`;
	}
	return `${num.toLocaleString(locale)} **is prime**`;
}

export function isSquare(num: number, locale: string) {
	const sqrt = Math.sqrt(num);
	const formatSqrt = sqrt.toLocaleString(locale);
	const formatNum = num.toLocaleString(locale);
	if (sqrt % 1 === 0) {
		// checks if square root is whole
		return `${formatNum} is a perfect square (\`${formatSqrt} \* ${formatSqrt} = ${formatNum}\`)`;
	} else {
		return `${formatNum} **is not** a perfect square`;
	}
}

// this function checks if the number is in a specific list of perfect numbers because the amount of perfect numbers below 2^53 is very low (only 7)
export function isPerfect(num: number, locale: string) {
	const formatNum = num.toLocaleString(locale);
	if (perfectNums.includes(num)) {
		return `${formatNum} **is perfect**`;
	} else {
		return `${formatNum} **is not** perfect`;
	}
}

export function collatz(start: number, locale: string) {
	if (start === 1) {
		return {
			sequence: '1',
			content: '1 reaches 1 at digit 1...',
			color: '#48c9b0'
		};
	}
	let current = start;
	let count = 1;
	const sequence = [];
	while (current !== 1 || count > 2048) {
		sequence.push(current.toLocaleString(locale));
		if (current % 2 === 0) {
			current /= 2;
		} else {
			current = current * 3 + 1;
		}
		count += 1;
	}
	if (current === 1) {
		sequence.push(1);
		return {
			sequence: sequence.join('; '),
			content: `${start.toLocaleString(
				locale
			)} reached 1 at digit **${count.toLocaleString(locale)}**`,
			color: '#48c9b0'
		};
	}
	return {
		sequence: 'Too long...',
		content: 'This sequence was too long for the bot to use.',
		color: '#e74c3c'
	};
}

export function chunkString(str: string, length: number): string[] {
	const chunks = [''];
	let charCount = 0;
	let currentChunkIndex = 0;
	const words = str.split(' ');
	for (let i = 0; i < words.length; i++) {
		const word = words[i] + ' ';
		chunks[currentChunkIndex] += word;
		charCount += word.length;
		if (charCount >= length) {
			charCount = 0;
			chunks.push('');
			currentChunkIndex += 1;
		}
	}
	return chunks.filter(chunk => chunk !== '' && chunk !== ' ');
}
function eratosthenes(num: number) {
	const array = [];
	const upperLimit = Math.ceil(Math.sqrt(num));
	const result = [];

	for (let i = 0; i < num; i++) {
		array.push(true);
	}

	for (let i = 2; i <= upperLimit; i++) {
		if (array[i]) {
			for (let j = i * i; j < num; j += i) {
				array[j] = false;
			}
		}
	}

	for (let i = 2; i < num; i++) {
		if (array[i]) {
			result.push(i);
		}
	}
	return result;
}
export const pi = new EmbedBuilder()
	.setColor(0xf0b27a)
	.setTitle('Pi π')
	.setDescription(
		'3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196442881097566593344612847564823378678316527120190914564856692346034861045432664821339360726024914127372458700660631558817488152092096282925409171536436789259036001133053054882046652138414695194151160943305727036575959195309218611738193261179310511854807446237996274956735188575272489122793818301194912...'
	);
export const e = new EmbedBuilder()
	.setColor(0x85c1e9)
	.setTitle("Euler's Number")
	.setDescription(
		'2.718281828459045235360287471352662497757247093699959574966967627724076630353547594571382178525166427427466391932003059921817413596629043572900334295260595630738132328627943490763233829880753195251019011573834187930702154089149934884167509244761460668082264800168477411853742345442437107539077744992069551702761838606261331384583000752044933826560297606737113200709328709127443747047230696977209310141692836819025515108657463772111252389784425056953696770785449969967946864454905987931636889230098793...'
	);
export const tau = new EmbedBuilder()
	.setColor(0x76d7c4)
	.setTitle('Tau τ')
	.setDescription(
		'6.283185307179586476925286766559005768394338798750211641949889184615632812572417997256069650684234135964296173026564613294187689219101164463450718816256962234900568205403877042211119289245897909860763928857621951331866892256951296467573566330542403818291297133846920697220908653296426787214520498282547449174013212631176349763041841925658508183430728735785180720022661061097640933042768293903883023218866114540731519183906184372234763865223586210237096148924759925499134703771505449782455876366023898...'
	);
export const phi = new EmbedBuilder()
	.setColor(0xf7dc6f)
	.setTitle('Phi Φ')
	.setDescription(
		'1.618033988749894848204586834365638117720309179805762862135448622705260462818902449707207204189391137484754088075386891752126633862223536931793180060766726354433389086595939582905638322661319928290267880675208766892501711696207032221043216269548626296313614438149758701220340805887954454749246185695364864449241044320771344947049565846788509874339442212544877066478091588460749988712400765217057517978834166256249407589069704000281210427621771117778053153171410117046665991466979873176135600670874807...'
	);
export const root2 = new EmbedBuilder()
	.setColor(0xd35400)
	.setTitle('Square Root of 2')
	.setDescription(
		'1.414213562373095048801688724209698078569671875376948073176679737990732478462107038850387534327641572735013846230912297024924836055850737212644121497099935831413222665927505592755799950501152782060571470109559971605970274534596862014728517418640889198609552329230484308714321450839762603627995251407989687253396546331808829640620615258352395054745750287759961729835575220337531857011354374603408498847160386899970699004815030544027790316454247823068492936918621580578463111596668713013015618568987237...'
	);
