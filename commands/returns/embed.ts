import { MessageEmbed } from "discord.js";

export const name = "embed";
export const description = "Sends an embed to a channel";
export const usage = "!embed <Title> <Description>";
export function execute(message, args) {
	let td = args.join(" ").split("|");
	let embed = new MessageEmbed().setTitle(td[0]).setDescription(td[1]);
	message.channel.send(embed);
}
