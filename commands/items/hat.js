module.exports = {
	description: "Flex on how rich you are by showing off your HATS",
	execute(message, _0, _1, _2, profileData) {
		let sendNone = true;
		if (profileData.inventory.includes("02")) {
			message.channel.send("https://tenor.com/view/crystal-tiara-gif-18445329");
			message.channel.send("Wow! You have a 𝓯𝓪𝓷𝓬𝔂 diamond crown");
			sendNone = false;
		}
		if (profileData.inventory.includes("03")) {
			message.channel.send(
				"https://tenor.com/view/afistful-of-dollars-clint-eastwood-man-with-no-name-hat-tip-gif-4268634"
			);
			message.channel.send("Wow! A cowboy hat");
			sendNone = false;
		}
		if (sendNone) {
			message.channel.send("You don't have any hats :(");
		}
	},
};
