const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "sends the rules for the server in an Embed",
	execute(message, args) {
		if (message.guild.id == "785642761814671381" || message.guild.id == "804079271986462811") {
			if (!args.length) {
				let rules = new MessageEmbed()
					.setColor("#80CED7")
					.setTitle("Amendments to the Carrel Crew Discord Server")
					.setDescription(
						"Follow these rules when talking in the server. If you break these rules multiple times, you will be muted."
					)
					.addFields(
						{
							name: "Amendment 1",
							value: "Don't spam in any channel",
						},
						{
							name: "Amendment 2",
							value:
								"Do not text or spam during school hours\n(You are allowed if your conversation is school-related or you are sending links)",
						},
						{
							name: "Amendment 3",
							value: "Be appropriate",
						},
						{
							name: "Amendment 4",
							value: "Don't beg for roles, levels, or Minco Dollars",
						},
						{
							name: "Amendment 5",
							value: "Act civil in voice chat",
						},
						{
							name: "Amendment 6",
							value: "DO NOT SPAM PING anyone (mute after 3 pings in a row)",
						}
					)
					.setFooter("You have the right to stand trial in a voice channel if you break any of these rules");
				message.channel.send(rules);
			} else if (args[0] == "im" || args[0] == "important") {
				let rulesEmbed = new MessageEmbed()
					.setColor("#E74C3C")
					.setTitle(":exclamation: Important Announcement:")
					.setDescription(
						"People have been too focused on the Discord server recently, and it's stopping us from focusing on class since people are getting a lot of Discord notifications."
					)
					.addFields({
						name: ":bulb: Tips",
						value:
							"change your status to **do not disturb** during class hours (click on your profile icon in the bottom left to change it)\nclose the Discord window when you aren't using it\ndo not talk in Discord during class hours unless you have a school-related question",
					});
				message.channel.send(rulesEmbed);
			}
		} else if (message.guild.id == "818509629842522112") {
			let rules = new MessageEmbed()
				.setTitle("Blobfish Rules")
				.setColor("F564CF")
				.setDescription(
					"Follow these rules when talking in the server. If you break these rules multiple times, you will be muted."
				)
				.addFields(
					{
						name: "Amendment 1",
						value: "No spamming or texting during school",
					},
					{
						name: "Amendment 2",
						value: "Don't send inappropriate messages",
					},
					{
						name: "Amendment 3",
						value: "Don't beg for roles/levels",
					},
					{
						name: "Amendment 4",
						value: "No one except Aiden may be a Supreme Blob",
					},
					{
						name: "Amendment 5",
						value: "If you disobey any rules, you will be muted",
					},
					{
						name: "Amendment 6",
						value: "DO NOT SPAM PING anyone (mute after 3 pings in a row)",
					}
				);
			message.channel.send(rules);
		}
	},
};
