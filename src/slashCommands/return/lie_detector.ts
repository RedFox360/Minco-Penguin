import { CommandData } from "../../types";

const responses = [
	"🔴 You are lying!",
	"🟢 You are telling the truth!",
	"🟡 hmmm... I need more info!",
	"🟢 I think you are telling the truth",
	"🔴 You are DEFINITELY lying",
];

export const data = {
	name: "lie_detector",
	description: "Check if you are lying...",
	options: [
		{
			name: "question",
			description: "A question",
			type: "STRING",
			required: true,
		},
	],
};

export async function run({ interaction }: CommandData) {
	const randomResponse =
		responses[Math.floor(Math.random() * responses.length)];
	const question = interaction.options.getString("question");

	await interaction.reply(`**${randomResponse}**\n*${question}*`);
}
