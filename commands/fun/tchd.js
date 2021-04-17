// the chat has died
module.exports = {
	name: "tchd",
	description: "Sends a random the chat has died message",
	execute() {
		let randomMessage = [
			"The chat has died :(",
			"What happened to the chat?",
			"WHAT??",
			"Silence...",
			"Quiet...",
			"Dead chat",
			"The chat is sad",
			"You're so mean, you killed the chat",
			"That's not very nice of you to kill the chat",
			"**DEAD SILENCE**",
			":cricket:",
			"Why why why?",
			"Chat = :(",
		];
		let random = Math.floor(Math.random() * randomMessage.length);
		return randomMessage[random];
	},
};
