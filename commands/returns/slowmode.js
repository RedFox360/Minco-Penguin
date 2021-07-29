const ms = require("ms");
const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	description: "[MANAGE CHANNELS] Changes slowmode",
	usage: "!slowmode <ms>",
	permissions: ["MANAGE_CHANNELS"],
	/** @param {Message} message */
	run(message, args) {
		if (!args.length) return "You didn't provide any arguments.";
		var slowmode;
		if (args[0] == "off") {
			slowmode = 0;
		} else if (isNaN(parseInt(args[0]))) {
			slowmode = ms(args.join(" ")) / 1000;
			if (isNaN(slowmode)) return "Enter a valid number";
		} else {
			slowmode = parseInt(args[0]);
		}
		if (slowmode > 21600) return "Please enter an amount less than or equal to 6 hours";
		message.channel.setRateLimitPerUser(slowmode, null);
		let confirmEmbed = new MessageEmbed()
			.setColor("#7E78D2")
			.setTitle("Slowmode")
			.setDescription(`Slowmode set to ${slowmode} seconds`);
		message.channel.send(confirmEmbed);
	},
};
