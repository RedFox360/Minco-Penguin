module.exports = {
	description: "puts spaces between characters in the say command",
	cooldown: 3,
	usage: "!spacesay <words>",
	execute(message, args) {
		let msgSplit = args.join(" ").split("");
		for (let i = 0; i < msgSplit.length; i++) {
			if (msgSplit[i] != "_" && msgSplit[i] != "*" && msgSplit[i] != "~") {
				if (msgSplit[i + 1] != "*" && msgSplit[i + 1] != "_" && msgSplit[i + 1] != "~")
					msgSplit[i] += " ";
			}
		}
		var msg = msgSplit.join("");
		message.channel.send(msg);
	},
};
