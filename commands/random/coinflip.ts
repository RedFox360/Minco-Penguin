export const name = "coinflip";
export const aliases = ["flip"];
export const description = 'Returns "heads" or "tails" based on a random outcome.';
export function execute(_, args) {
	let random = Math.floor(Math.random() * 2);
	var options = [];
	if (args[0] == "yn") options = [":thumbsup: Yes", ":thumbsdown: No"];
	else options = [":coin: Heads", ":coin: Tails"];
	return options[random];
}
