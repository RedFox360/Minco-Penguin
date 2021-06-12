// the chat has died
module.exports = {
	description: "Sends a random the chat has died message",
	execute: () =>
		[
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
		].rand(),
};
