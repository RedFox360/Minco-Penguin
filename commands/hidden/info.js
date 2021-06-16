const { Message, MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
module.exports = {
	/** @param {Message} message */
	execute(message) {
		const mention = message.mentions.users.first();
		const author = mention ?? message.author;
		const member = message.guild.members.cache.get(author.id);
		const infoEmbed = new MessageEmbed()
			.setAuthor(author.tag, author.avatarURL(), author.avatarURL())
			.setColor("16A085") // darkish green
			.addFields(
				{
					name: "Roles",
					value: member.roles.cache
						.array()
						.map((role) => `<@&${role.id}>`)
						.join(" "),

					inline: true,
				},
				{
					name: "Created at",
					value: format(author.createdAt),
					inline: true,
				},
				{
					name: "Joined at",
					value: format(member.joinedAt),
					inline: true,
				}
			);
	},
};

function format(time) {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	const formatted = dayjs.tz(time, "PST").format("ddd MMM D, YYYY HH:mm");

	return formatted + " PST";
}
