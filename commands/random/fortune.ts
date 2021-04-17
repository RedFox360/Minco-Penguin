export const name = "fortune";
export const description = "Gives you a fortune";
export const cooldown = 4;
export function execute() {
	let fortunes = [
		"For the next coming bot war, you should be on the side of Minco Penguin",
		"Thanos will come alive again and *snap*",
		"Tomorrow you will wake up with a cockroach under your pillow",
		"Your internet will break down tomorrow",
		"There will be **no** tomorrow",
		"You will grow a mustache tomorrow (if you are a boy)",
	];

	let random = Math.floor(Math.random() * fortunes.length);
	return fortunes[random];
}
