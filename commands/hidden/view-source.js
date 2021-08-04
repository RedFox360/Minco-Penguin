const { readFileSync } = require("fs");
module.exports = {
	description: "[OWNER ONLY] View the contents of a file",

	run(message, args) {
		if (message.author.id != "724786310711214118") return;
		let file;
		try {
			file = readFileSync("./" + args.join(" "), { encoding: "utf-8" });
		} catch (error) {
			return message.reply("An error occured / enter a valid file");
		}
		message.channel.send(`\`\`\`${args.join(" ").split(".")[1]}
${file}
\`\`\``);
	},
};
