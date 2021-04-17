import { MessageEmbed } from "discord.js";

export const name = "announce";
export const description = "[ADMIN ONLY] Sends a message in the announcement channel";
export const usage = "!announce <message>";
export function execute(message, args) {
	if (
		message.member.hasPermission("ADMINISTRATOR") ||
		message.member.roles.cache.find((r) => r.name === "Moderator") ||
		message.author.id == "724786310711214118"
	) {
		let announcementEmbed = new MessageEmbed().setTitle("Announcement").setDescription(args.join(" ")).setColor("32E6C5");
		message.guild.systemChannel.send(announcementEmbed);
	} else {
		message.reply("This command can only be used by Admins");
	}
}
