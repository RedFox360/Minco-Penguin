import { CommandData } from "../../types";
import { MessageEmbed } from "discord.js";
import { transpile } from "typescript";
import prettyMs from "pretty-ms";

export const data = {
	name: "eval",
	description: "Execute Javascript code",
	options: [
		{
			name: "code",
			type: "STRING",
			description: "The code to execute",
			required: true,
		},
	],
};

export async function run({ interaction }: CommandData) {
	if (
		interaction.user.id !== "724786310711214118" ||
		interaction.user.id !== "724786310711214118"
	) {
		await interaction.reply({
			content: "This command can only be used by the owner",
			ephemeral: true,
		});
		return;
	}
	try {
		const code = transpile(interaction.options.getString("code"), {
			esModuleInterop: true,
			moduleResolution: 2,
			resolveJsonModule: true,
			target: 99,
		});
		const timeStamp1 = Date.now();
		let evaled = eval(code);
		if (typeof evaled !== "string") evaled = require("util").inspect(evaled);
		const codeEvaled = "```js\n" + clean(evaled) + "\n```";
		const codeFormat = "```js\n" + code + "\n```";
		const responseEmbed = new MessageEmbed()
			.setTitle("<:check_circle:872594799662858270>  Eval...")
			.addFields(
				{
					name: "Input",
					value: codeFormat,
				},
				{
					name: "Output",
					value: codeEvaled,
				},
				{
					name: "Time taken",
					value: prettyMs(Date.now() - timeStamp1),
				}
			)
			.setColor("#B8FF8B");
		if (code.includes("interaction.reply")) {
			await interaction.followUp({ embeds: [responseEmbed] });
		} else {
			await interaction.reply({ embeds: [responseEmbed] });
		}
	} catch (err) {
		const errorEmbed = new MessageEmbed()
			.setTitle("<:x_circle:872594799553839114>  **ERROR** ")
			.setDescription("```xl\n" + clean(err) + "\n```")
			.setColor("#E48383");
		interaction.reply({
			embeds: [errorEmbed],
			ephemeral: true,
		});
	}
}
function clean(text: any) {
	if (typeof text === "string")
		return text
			.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203));
	else return text;
}
