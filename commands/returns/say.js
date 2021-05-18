module.exports = {
	description: "This is a say command for Minco Penguin",
	cooldown: 3,
	usage: "!say <words>",
	aliases: ["sayd"],
	execute(message, args, cmd, client) {
		if (!args.length) return "You didn't provide any arguments.";
		if (args[0].startsWith("<#")) {
			var channel = args[0];
			channel = channel.replace("<", "").replace(">", "").replace("#", "");
			args.shift();
			let msg = args.join(" ");
			const chnl = client.channels.cache.get(channel);
			chnl.send(msg);
			message.react("✅");
		} else {
			message.channel.send(args.join(" "));
		}
		if (cmd === "sayd") message.delete();
	},
};
