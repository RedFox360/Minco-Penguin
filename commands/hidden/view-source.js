const { readFile } = require("fs");
const { MessageAttachment } = require("discord.js");
module.exports = {
	description: "[OWNER ONLY] View the contents of a file",

	run(message, args) {
		if (message.author.id != "724786310711214118") return;
		readFile(args.join(" "), (err, data) => {
			if (err) return message.channel.send("There was an error / enter a valid file");

			message.channel.send(new MessageAttachment(data));
		});
	},
};
