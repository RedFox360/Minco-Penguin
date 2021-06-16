const { Message, MessageEmbed } = require("discord.js");
const dayjs = require("dayjs");
module.exports = {
	/** @param {Message} message */
	execute(message) {
		const mention = message.mentions.users.first();
		const author = mention ?? message.author;
		const member = message.guild.members.cache.get(author.id);
		message.channel.send(
			new MessageEmbed()
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
				)
				.setFooter(`User ID: ${author.id}`)
		);
	},
};

function format(time) {
	const formatted = dayjs(time).format("ddd MMM D, YYYY HH:mm");

	return formatted + " PST";
}
