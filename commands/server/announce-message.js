const ordinal = require("ordinal");
const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"[MANAGE SERVER] Set the welcome and leave messages for a server. Use !announce-message format for a formatting guide.",
	usage: "!announce-message <join/joindm/leave> <message>/default",
	permissions: ["MANAGE_GUILD"],
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
		} else if (first == "joindm") {
			if (args[0] == "default") {
				await serverModel.findOneAndUpdate(
					{ serverID: message.guild.id },
					{ welcomeDM: undefined }
				);
				return "Welcome DM turned off";
			}
			await serverModel.findOneAndUpdate({ serverID: message.guild.id }, { welcomeDM: msg });
		} else {
			return "Valid usage: !announce-message <join/leave> <message>";
		}
		const members = await message.guild.members.fetch();
		const memberCount = members.filter((member) => !member.user.bot).size;
		const memberCountOrdinal = ordinal(memberCount);
		message.channel.send(
			"Message updated, example:\n" +
				msg
					.replace(/\{server\}/g, message.guild.name)
					.replace(/\{mention\}/g, message.author.toString())
					.replace(/\{ord_member_count\}/g, memberCountOrdinal)
					.replace(/\{member_count\}/g, memberCount)
					.replace(/\{user\}/g, message.author.username)
					.replace(/\{user_tag\}/g, message.author.tag)
		);
	},
};
