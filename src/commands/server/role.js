const { default: serverModel } = require("../../models/serverSchema");
module.exports = {
	description:
		"[ADMIN ONLY] The main role will be given to members who join the server. Mute role allows muting to work. The bot role will be given to bots who join the server.",
	usage: "!role <mute/main/mod/bot> <@role>",
	permissions: ["ADMINISTRATOR"],
	async run(message, args) {
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
		} else if (args[0] == "bot") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					botRole: role.id,
				}
			);
			return `Bot role set to <@&${role.id}>`;
		} else {
			return "Valid usage: !role <mute/main> <@role>";
		}
	},
};
