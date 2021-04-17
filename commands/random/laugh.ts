export const name = "laugh";
export const description = "Fun command: sends a random laugh";
export const aliases = ["haha", "hehe"];
export function execute() {
	let laughs = ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"];
	let random = Math.floor(Math.random() * laughs.length);
	return laughs[random];
}
