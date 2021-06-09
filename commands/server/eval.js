const Discord = require("discord.js");
const ms = require("ms");
const prettyMs = require("pretty-ms");
const profileModel = require("../../models/profileSchema");
const serverModel = require("../../models/serverSchema");
const randomInt = require("../../functions/random");
module.exports = {
	description: "[SAMEER ONLY] Eval command for testing",

	async execute(message, args, cmd, client, profileData) {
		if (message.author.id != "724786310711214118") return "This command can only be used by Sameer";
		try {
			eval(args.join(" "));
		} catch (err) {
			console.error(err);
			message.channel.send("An error occured. Check the console for full details");
		}
	},
};
