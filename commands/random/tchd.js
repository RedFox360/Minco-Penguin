// the chat has died
module.exports = {
	description: "Sends a random the chat has died message",
	execute: () =>
		[
			"The chat has died :(",
			"Silence...",
			"Quiet...",
			"Dead chat",
			"The chat is sad",
			"You're so mean, you killed the chat",
			"That's not very nice of you to kill the chat",
			"**DEAD SILENCE**",
			":cricket:",
			"*crickets*",
			"...silence... more silence",
			"🪦⚰️💬",
			"Why why why?",
			"Chat = :(",
		].rand(),
};
