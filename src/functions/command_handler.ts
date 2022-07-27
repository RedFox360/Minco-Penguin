import { EmbedBuilder, Message } from 'discord.js';
import prettyMs from 'pretty-ms';
import { transpile } from 'typescript';
import { inspect } from 'util';
import slashHandler from '../handlers/slash_handler';

export default async function commandHandler(message: Message<true>) {
	const inDev = !process.argv.includes('--prod');
	const prefix = inDev ? '$!' : '!';
	if (message.content.startsWith(`${prefix}eval `)) {
		const typescriptCode = message.content.substring(5);
		if (!typescriptCode || typescriptCode === '') return;
		const code = transpile(typescriptCode, {
			esModuleInterop: true,
			moduleResolution: 2,
			resolveJsonModule: true,
			target: 99
		});
		const timeStamp1 = Date.now();
		let evaled: any;
		try {
			evaled = eval(code);
		} catch (err) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('<:x_circle:872594799553839114>  **ERROR** ')
				.setDescription('```xl\n' + cleanText(err) + '\n```')
				.setColor(0xe48383);
			await message.reply({
				embeds: [errorEmbed]
			});
			return;
		}
		if (typeof evaled !== 'string') evaled = inspect(evaled);
		const codeEvaled = '```js\n' + cleanText(evaled) + '\n```';
		const codeFormat = '```js\n' + code + '\n```';
		const responseEmbed = new EmbedBuilder()
			.setTitle('Eval...')
			.addFields(
				{
					name: 'Input',
					value: codeFormat
				},
				{
					name: 'Output',
					value: codeEvaled
				},
				{
					name: 'Time taken',
					value: prettyMs(Date.now() - timeStamp1)
				}
			)
			.setColor(0xb8ff8b);
		await message.reply({ embeds: [responseEmbed] });
	} else if (message.content === `${prefix}reload commands`) {
		await slashHandler(message.client, inDev, true);
		await message.reply('Reloaded all commands');
	}
}
function cleanText(text: any) {
	if (typeof text === 'string')
		return text
			.replace(/`/g, '`' + String.fromCharCode(8203))
			.replace(/@/g, '@' + String.fromCharCode(8203));
	else return text;
}
