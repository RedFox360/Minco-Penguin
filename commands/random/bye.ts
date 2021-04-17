export const name = "bye";
export const description = "Sends a random goodbye message";
export function execute() {
	let byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
	let random = Math.floor(Math.random() * byes.length);
	return byes[random];
}
