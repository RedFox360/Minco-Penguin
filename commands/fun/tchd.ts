// the chat has died

export const name = "tchd";
export const description = "Sends a random the chat has died message";
export function execute() {
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
}
