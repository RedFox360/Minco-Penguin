const { Message, MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
module.exports = {
	/** @param {Message} message */
	execute(message) {
		const member = message.mentions.member.first() ?? message.member;
		const author = mention.user ?? message.author;
		message.channel.send(
			new MessageEmbed()
				.setAuthor(author.tag, author.avatarURL(), author.avatarURL())
				.setColor("16A085") // darkish green
				.addFields(
					{
						name: "Roles",
						value: member.roles.cache
							.array()
							.filter((role) => !role.name.includes("everyone"))
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
				)
				.setFooter(`User ID: ${author.id}`)
		);
	},
};

const format = (time) => {
	dayjs.extend(utc);
	dayjs.extend(timezone);
	return dayjs.tz(time, "America/Los_Angeles").format("ddd [**]MMM D, YYYY[**] HH:mm [PST]");
};
