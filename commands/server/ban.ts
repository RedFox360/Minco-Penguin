import { Message } from "discord.js";

export const name = "ban";
export const description = "[ADMIN ONLY] Ban members";
export const usage = "!ban <@user>";
/** @param {Message} message */
export function execute(message) {
	if (message.member.hasPermission("BAN_MEMBERS")) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		let memberTarget = message.guild.members.cache.get(mention.id);
		if (memberTarget.hasPermission("MANAGE_SERVER") && memberTarget.hasPermission("BAN_MEMBERS"))
			return message.channel.send("This person cannot be banned.");
		memberTarget.ban();
		return `${memberTarget.tag} was banned from the server.`;
	}
}
