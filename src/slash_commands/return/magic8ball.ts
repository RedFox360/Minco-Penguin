import { SlashCommand } from '../../types';

import responses from '../../json/8ball_responses.json';
const { yesAnswers, noAnswers, neutralAnswers } = responses;

const magic8ball = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('magic8ball')
			.setDescription(
				'A magic 8 ball that can answer any question!'
			)
			.addStringOption(option =>
				option
					.setName('question')
					.setDescription('Your question for the 8 ball')
					.setRequired(true)
			)
	)
	.setRun(async interaction => {
		const question = interaction.options.getString('question');
		const answer = getAnswer();

		await interaction.reply(`:8ball: **${answer}**
*${question}*`);
	});

function getAnswer() {
	const randomNum = Math.floor(Math.random() * 11); // 0 - 10
	if (randomNum === 0)
		// neutral
		return neutralAnswers[
			Math.floor(Math.random() * neutralAnswers.length)
		];
	else if (randomNum <= 5)
		// no
		return noAnswers[
			Math.floor(Math.random() * noAnswers.length)
		];
	// yes
	else
		return yesAnswers[
			Math.floor(Math.random() * yesAnswers.length)
		];
}

export default magic8ball;
