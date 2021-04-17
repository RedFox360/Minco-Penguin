export const name = "hello";
export const description = "Returns a random hello message.";
export const cooldown = 1;
export const aliases = ["howdy", "hi"];
export function execute(message) {
	let hellos = [
		"Hi :)",
		"Hai!",
		"Hello! :)",
		`Salutations, ${message.author.toString()}`,
		"Bonjour!",
		`Greetings, ${message.author.toString()}`,
		"Howdy! :cowboy:",
	];
	let random = Math.floor(Math.random() * hellos.length);
	return hellos[random];
}
