const serverModel = require("../../models/serverSchema");
module.exports = {
	description:
		"[ADMIN ONLY] Set the welcome and leave messages for a server. Use !announce-message format for a formatting guide",
	usage: "!announce-message <join/leave> <message>",
	execute(message, args) {
		const first = args[0];
		if (!first)
			return "Valid usage: !announce-message <join/leave> <message> or !announce-message format";
		args.shift();
		if (first == "format") {
			return "These texts will be converted to variables.\n{server} = the server name\n{mention} = mention the user who joined\n{member_count} = the new server member count\n{ord_member_count} ordinal member count\n{user} = the username of the user who joined\n{user_tag} = the username including tag";
		}

		if (!args.length) return "Valid usage: !announce-message <join/leave> <message>";
		const msg = args.join(" ");
		if (first == "join") {
			await serverModel.findOneAndUpdate({ serverID: message.guild.id }, { welcomeMessage: msg });
			return "Welcome message sent";
		} else if (first == "leave") {
			await serverModel.findOneAndUpdate({ serverID: message.guild.id }, { leaveMessage: msg });
		} else {
			return "Valid usage: !announce-message <join/leave> <message>";
		}
	},
};
