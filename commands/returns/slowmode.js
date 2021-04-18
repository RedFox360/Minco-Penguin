const ms = require("ms");
const { MessageEmbed, Message } = require("discord.js");
module.exports = {
	description: "[MANAGE CHANNELS] Changes slowmode",
	usage: "!slowmode <number>",
	/** @param {Message} message */
	execute(message, args) {
		if (message.member.hasPermission("MANAGE_CHANNELS")) {
			if (!args.length) return "You didn't provide any arguments.";
			var slowmode;
			if (args[0] == "off") slowmode = 0;
			else slowmode = ms(args.join(" ")) / 1000;
			if (isNaN(slowmode)) return "Enter a valid number";
			if (slowmode > 21600) return "Please enter an amount less than or equal to 6 hours";
			message.channel.setRateLimitPerUser(slowmode, null);
			let confirmEmbed = new MessageEmbed()
				.setColor("#7E78D2")
				.setTitle("Slowmode")
				.setDescription(`Slowmode set to ${slowmode} seconds`);
			message.channel.send(confirmEmbed);
		} else {
			return "You don't have permissions to change slowmode.";
		}
	},
};
