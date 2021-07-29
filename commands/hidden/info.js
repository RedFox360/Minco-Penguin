const { Message, MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
	/** @param {Message} message */
	run(message) {
		const member = message.mentions.members.first() ?? message.member;
		const author = member?.user ?? message.author;
		const infoEmbed = new MessageEmbed()
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
			);
		if (message.guild) infoEmbed.setFooter(`User ID: ${author.id}`);
		message.channel.send(infoEmbed);
	},
};

const format = (time) =>
	dayjs.tz(time, "America/Los_Angeles").format("ddd [**]MMM D, YYYY[**] hh:mm A [PST]");
