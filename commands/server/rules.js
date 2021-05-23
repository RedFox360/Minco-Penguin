// @ts-check
const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	description: "sends the rules for the server in an Embed",
	/**@param {Message} message*/
	execute(message, args) {
		if (message.guild.id == "785642761814671381") {
			if (!args.length) {
				message.channel.send(carrelRules);
			} else if (args[0] == "im" || args[0] == "important") {
				message.channel.send(importantRules);
			}
		} else if (message.guild.id == "818509629842522112") {
			message.channel.send(blobfishRules);
		}
		if (message.guild.id == "840339755350884402") {
			message.channel.send(roleplayRules);
		}
	},
};

const importantRules = new MessageEmbed()
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

const blobfishRules = new MessageEmbed()
	.setTitle("Blobfish Rules")
	.setColor("F564CF")
	.setDescription("Follow these rules when talking in the server. If you break these rules multiple times, you will be muted.")
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

const carrelRules = new MessageEmbed()
	.setColor("#80CED7")
	.setTitle("Amendments to the Carrel Crew Discord Server")
	.setDescription("Follow these rules when talking in the server. If you break these rules multiple times, you will be muted.")
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

const roleplayRules = new MessageEmbed()
	.setTitle("Roleplay Rules")
	.setDescription("Follow these rules always when participating in the roleplay.")
	.addFields(
		{
			name: "Rule 1",
			value: "Do not switch sides just to get information for your character.",
		},
		{
			name: "Rule 2",
			value: "Do not bribe anyone with MD to tell secrets",
		},
		{
			name: "Rule 3",
			value: "Do not spam",
		}
	);
