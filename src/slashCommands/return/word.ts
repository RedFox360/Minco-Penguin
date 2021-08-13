import { CommandData } from "../../types";

const byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
const laughs = [
	"MWAHAHAHA!",
	"BHAHHAHAHAHHA",
	"tEEHee",
	"hehe",
	":rofl:",
	"Hahahaha",
];

export const data = {
	name: "word",
	description: "Send a random hello/goodbye/laugh!",
	options: [
		{
			name: "phrase_type",
			description: "The phrase type",
			type: "STRING",
			required: true,
			choices: [
				{ name: "Hello", value: "hello" },
				{ name: "Goodbye", value: "bye" },
				{ name: "Laugh", value: "laugh" },
			],
		},
		{
			name: "user",
			description: "The user to say hello/bye to",
			type: "USER",
			required: false,
		},
	],
};

export async function run({ interaction }: CommandData) {
	const phraseType = interaction.options.getString("phrase_type");
	const user = interaction.options.getString("user") ?? interaction.user;
	const hellos = [
		"Hi :)",
		"Hai!",
		"Hello! :)",
		`Salutations, ${user.toString()}`,
		"Bonjour!",
		`Greetings, ${user.toString()}`,
		"Howdy! :cowboy:",
	];
	switch (phraseType) {
		case "hello": {
			await interaction.reply(
				hellos[Math.floor(Math.random() * hellos.length)]
			);
			break;
		}
		case "bye": {
			await interaction.reply(byes[Math.floor(Math.random() * byes.length)]);
			break;
		}
		case "laugh": {
			await interaction.reply(
				laughs[Math.floor(Math.random() * laughs.length)]
			);
			break;
		}
	}
}
