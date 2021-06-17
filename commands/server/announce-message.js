const ordinal = require("ordinal");
const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"[ADMIN ONLY] Set the welcome and leave messages for a server. Use !announce-message format for a formatting guide",
	usage: "!announce-message <join/leave> <message/'default'>",
	async execute(message, args) {
		const first = args[0];
		if (!first)
			return "Valid usage: !announce-message <join/leave> <message> or !announce-message format";
		args.shift();
		if (first == "format") {
			return `These texts will be converted to variables.
**{server}** = the server name
**{mention}** = mention the user who joined
**{member_count} = the new server member count
**{ord_member_count}** = ordinal member count
**{user}** = the username of the user who joined
**{user_tag}** = the username including tag`;
		}

		if (!args.length) return "Valid usage: !announce-message <join/leave> <message>";
		let msg = args.join(" ");
		if (first == "join") {
			if (args[0] == "default")
				msg = "Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!";
			await serverModel.findOneAndUpdate({ serverID: message.guild.id }, { welcomeMessage: msg });
		} else if (first == "leave") {
			if (args[0] == "default")
				msg = "It seems {user_tag} has left us. We now have {member_count} members.";
			await serverModel.findOneAndUpdate({ serverID: message.guild.id }, { leaveMessage: msg });
		} else {
			return "Valid usage: !announce-message <join/leave> <message>";
		}
		var members = await member.guild.members.fetch();
		var memberCount = members.filter((member) => !member.user.bot).size;
		var memberCountOrdinal = ordinal(memberCount);
		const member = message.member;
		message.channel.send(
			"Message updated, example:\n" +
				msg
					.replace(/\{server\}/g, member.guild.name)
					.replace(/\{mention\}/g, `<@${member.id}>`)
					.replace(/\{ord_member_count\}/g, memberCountOrdinal)
					.replace(/\{member_count\}/g, memberCount)
					.replace(/\{user\}/g, member.user.username)
					.replace(/\{user_tag\}/g, member.user.tag)
		);
	},
};
