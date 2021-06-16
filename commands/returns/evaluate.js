module.exports = {
	description: "Solve any math equation",
	usage: "!evaluate/solve/math <equation>",
	aliases: ["solve", "math"],
	execute(message, args) {
		if (!args.length) return "Enter a math equation";
		const equation = args.join(" ");
		try {
			const result = math.evaluate(equation);

			message.channel.send(`${equation} = **${result}**`);
		} catch (err) {
			message.channel.send("Enter a valid math equation");
		}
	},
};
