import { Message } from "discord.js";

export const name = "kick";
export const description = "[ADMIN ONLY] Kick members";
export const usage = "!kick <@user>";
/** @param {Message} message */
export function execute(message) {
	if (message.member.hasPermission("KICK_MEMBERS")) {
		const mention = message.mentions.users.first();
		if (!mention) return "Mention a valid user";
		let memberTarget = message.guild.members.cache.get(mention.id);
		if (memberTarget.hasPermission("MANAGE_SERVER") && memberTarget.hasPermission("KICK_MEMBERS"))
			return message.channel.send("This person cannot be kicked.");
		memberTarget.kick();
		return `${memberTarget.tag} was kicked from the server.`;
	}
}
