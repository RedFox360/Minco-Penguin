export const name = "dice";
export const aliases = ["roll", "diceroll", "die"];
export const description = "Roll a die (returns a random number between 1 and 6, inclusive)";
export function execute() {
	let random = Math.floor(Math.random() * 6) + 1;
	return random.toString();
}
