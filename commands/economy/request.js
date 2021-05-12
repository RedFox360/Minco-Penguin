module.exports = {
	description:
		"Buy items\nBuy a drawing: !buy drawing <drawing> (sends a request to Claire, Minco Penguin will DM you with more info)",
	usage: "!buy drawing <drawing>",
	async execute(message, args, _, client, profileData) {
		if (!args.length) return "You didn't provide any arguments";
		if (args[0] == "drawing") {
			require("../../functions/request_drawing")(message, args, client, profileData);
		} else if (args[0] == "meme") {
			require("../../functions/request_meme")(message, args, client, profileData);
		}
	},
};
