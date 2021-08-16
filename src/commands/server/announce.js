const { default: serverModel } = require("../../models/serverSchema");
module.exports = {
	description: "[MANAGE SERVER] Silence or turn on join/ban messages",
	usage: "!announce <joins/bans> <on/off>",
	permissions: ["MANAGE_GUILD"],
	async run(message, args) {
		if (args.length < 2) return "Valid usage: !announce <joins/bans> <on/off>";
		if (args[1] != "off" && args[1] != "on")
			return "Valid usage: !announce <joins/bans> <on/off>";
		const silenced = args[1] == "off";
		if (args[0] == "joins") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					silenceJoins: silenced,
				}
			);
			return "Join messages silenced";
		} else if (args[0] == "bans") {
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					silenceBans: silenced,
				}
			);
			return "Ban messages silenced";
		} else {
			return "Valid usage: !announce <joins/bans> <on/off>";
		}
	},
};
