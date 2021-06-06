module.exports = {
	description: "[SAMEER ONLY] Eval command for testing",

	execute(message, args) {
		if (message.author.id != "724786310711214118") return "This command can only be used by Sameer";
		try {
			eval(args.join(" "));
		} catch (err) {
			console.error(err);
			message.channel.send("An error occured. Check the console for full details");
		}
	},
};
