import { CommandData } from "../../types";
import { SlashCommandBuilder } from "@discordjs/builders";

const responses = [
	"🔴 You are lying!",
	"🟢 You are telling the truth!",
	"🟡 hmmm... I need more info!",
	"🟢 I think you are telling the truth",
	"🔴 You are DEFINITELY lying",
];

export const data = new SlashCommandBuilder()
	.setName("lie_detector")
	.setDescription("Check if you are lying")
	.addStringOption((option) =>
		option.setName("question").setDescription("A question").setRequired(true)
	);

export async function run({ interaction }: CommandData) {
	const randomResponse =
		responses[Math.floor(Math.random() * responses.length)];
	const question = interaction.options.getString("question");

	await interaction.reply(`**${randomResponse}**\n*${question}*`);
}
