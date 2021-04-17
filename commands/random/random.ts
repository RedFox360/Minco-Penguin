export const name = "random";
export const description = "Returns a random number between 2 numbers";
export const aliases = ["rand"];
export const usage = "!random <min number> <max number>";
export function execute(_, args) {
	let min = parseInt(args[0]);
	let max = parseInt(args[1]);
	if (isNaN(min) || isNaN(max)) return "Enter valid numbers";
	if (max < min) return "Your second number must be greater than your first number";
	let random = Math.floor(Math.random() * (max - min + 1)) + min;
	return random.toLocaleString();
}
