import { CommandData } from "../../types";
import { ColorResolvable, MessageEmbed } from "discord.js";

export const data = {
	name: "magic8ball",
	description: "A magic 8 ball that can answer any question!",
	options: [
		{
			name: "question",
			description: "Your question for the 8 ball",
			type: "STRING",
			required: true,
		},
	],
};
export async function run({ interaction }: CommandData) {
	const question = interaction.options.getString("question");
	let yesAnswers = [
		"Yes",
		"OBVIOUSLY",
		"Undoubtedly",
		"Ofc",
		"No question!",
		"Of course!!!!",
		"Definitely",
		"Totally!",
		"YES",
		"YESSSS",
		"Yea",
		"Seriously? YES",
		"Yes, DUH",
	];
	let noAnswers = [
		"No",
		"OBVIOUSLY NO",
		"Doubtful",
		"SERIOUSLY? NO",
		"Nah",
		"...No",
		"Probably not.",
		"Are you kidding me? Definitely not.",
		"Why did you even ask that? No!",
	];
	let neutralAnswers = [
		"It is decidedly so",
		"I am not completely sure",
		"Why did you even ask that?",
		"Sorry, I was confunded. Try again.",
		"Meh",
		"eh",
		"Ya think so?",
		"Maybe",
	];
	let yesNoN = Math.floor(Math.random() * 11);
	let answer: string;
	let embedColor: ColorResolvable;
	if (yesNoN == 0) {
		// neutral
		embedColor = "#f9f785";
		answer = neutralAnswers[Math.floor(Math.random() * neutralAnswers.length)];
	} else if (yesNoN <= 5) {
		// no
		embedColor = "#E48383";
		answer = noAnswers[Math.floor(Math.random() * noAnswers.length)];
	} else {
		// yes
		embedColor = "#B8FF8B";
		answer = yesAnswers[Math.floor(Math.random() * yesAnswers.length)];
	}

	const embed = new MessageEmbed()
		.setTitle(`:8ball: ${answer}`)
		.setDescription(question)
		.setColor(embedColor);

	interaction.reply({ embeds: [embed] });
}
