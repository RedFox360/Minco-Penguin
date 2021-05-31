const { writeFile } = require("fs");
module.exports = {
	usage: "!status <TYPE> <info>",
	description: "[SAMEER ONLY] changes the status of the bot",
	execute(message, args, _, client) {
		const type = args[0].toUpperCase();

		const validTypes = ["COMPETING", "CUSTOM_STATUS", "LISTENING", "PLAYING", "STREAMING", "WATCHING"];
		if (!validTypes.includes(type)) return "Enter a valid type";
		args.shift();
		const info = args.join(" ");
		const hasErr = false;
		writeFile("../../functions/status.txt", `${type}\n${info}`, (err) => {
			if (err) {
				console.error(err);
				hasErr = true;
			}
		});
		if (hasErr) return "There was an error writing to the file.";

		message.client.user.setActivity(info, { type });

		message.channel.send(`Status changed to ${type} ${info}`);
	},
};
