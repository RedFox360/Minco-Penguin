const serverModel = require("../../models/serverSchema");
module.exports = {
	description: "[ADMIN ONLY] Set the mute role, main role, or mod role of the server",
	usage: "!role <mute/main> <@role>",

	async execute(message, args) {
		if (!message.member.hasPermission("ADMINISTRATOR"))
			return "You don't have the correct permissions to execute this command";
		const role = message.mentions.roles.first();
		if (!role) return "Mention a valid role";
		if (args[0] == "main") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					mainRole: role.id,
				}
			);
			return `Main role set to <@&${role.id}>`;
		} else if (args[0] == "mute") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					muteRole: role.id,
				}
			);
			return `Mute role set to <@&${role.id}>`;
		} else if (args[0] == "mod") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					muteRole: role.id,
				}
			);
			return `Moderator role set to <@&${role.id}>`;
		} else {
			return "Valid usage: !role <mute/main> <@role>";
		}
	},
};
