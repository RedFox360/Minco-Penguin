const serverModel = require("../../models/serverSchema");
module.exports = {
	description: "[ADMIN ONLY] Silence or turn on join/ban messages",
	usage: "!announce <joins/bans> <on/off>",
	async execute(message, args) {
		if (!message.member.hasPermission("ADMINISTRATOR"))
			return "This command can only be used by admins";

		if (args.length < 2) return "Valid usage: !announce <joins/bans> <on/off>";
		if (args[1] != "off" && args[1] != "on") return "Valid usage: !announce <joins/bans> <on/off>";
		const silenced = args[1] == "off";
		if (args[0] == "joins") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					silenceJoins: silenced,
				}
			);
		} else if (args[0] == "bans") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					silenceBans: silenced,
				}
			);
		} else {
			return "Valid usage: !announce <joins/bans> <on/off>";
		}
	},
};
