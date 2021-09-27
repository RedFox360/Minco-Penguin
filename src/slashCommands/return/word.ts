import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

export const data = new SlashCommandBuilder()
	.setName("word")
	.setDescription("Send a random hello/goodbye/laugh")
	.addStringOption((option) =>
		option
			.setName("phrase_type")
			.setDescription("The phrase type")
			.setRequired(true)
			.addChoice("Hello", "hello")
			.addChoice("Goodbye", "bye")
			.addChoice("Laugh", "laugh")
			.addChoice("Dead chat", "tchd")
	)
	.addUserOption((option) =>
		option
			.setName("user")
			.setDescription("The user the bot will talk to")
			.setRequired(false)
	);

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
		case "tchd": {
			await interaction.reply(tchds[Math.floor(Math.random() * tchds.length)]);
			break;
		}
	}
}

const byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
const laughs = [
	"MWAHAHAHA!",
	"BHAHHAHAHAHHA",
	"tEEHee",
	"hehe",
	":rofl:",
	"Hahahaha",
];
const tchds = [
	"The chat has died :(",
	"Silence...",
	"Quiet...",
	"Dead chat",
	"The chat is sad",
	"You're so mean, you killed the chat",
	"That's not very nice of you to kill the chat",
	"**DEAD SILENCE**",
	":cricket:",
	"*crickets*",
	"...silence... more silence",
	"🪦⚰️💬",
	"Why why why?",
	"Chat = :(",
];
