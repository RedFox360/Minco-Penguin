import { MessageEmbed, Message } from "discord.js";

export const name = "magic8ball";
export const description = "A magic 8 ball in Discord";
export const cooldown = 4;
export const usage = "!magic8ball <Question>";
export const aliases = ["8b", "magic8b", "8ball"];
export function execute(message: Message, args) {
	if (args.join(" ").replace(" ", "").toLowerCase().includes("crush"))
		return message.channel.send("Stop asking questions about crushes!");
	let answers = [
		"Yes",
		"No",
		"I am not completely sure",
		"It is decidedly so",
		"OBVIOUSLY",
		"OBVIOUSLY No",
		"Doubtful",
		"Undoubtedly",
		"SERIOUSLY? NO",
		"Ya think so?",
		"Ofc",
		"Why did you even ask that?",
		"Nah",
		"Meh",
		"No question!",
		"Sorry, I was confunded. Try again.",
		"Probably not.",
		"eh",
		"Of course!!!!",
		"Are you kidding me? Definitely not.",
		"Really?",
		"Ya think so?",
		"Totally!",
		"YES",
		"YESSSS",
		"Yea",
		"Seriously? YES",
		"Yes, DUH",
	];
	let random = Math.floor(Math.random() * answers.length);
	var noPhrases = ["no", "doubtful", "nah"];
	var yesPhrases = ["no question"];
	var color = "32E6C5";
	for (let phrase of noPhrases) {
		if (answers[random].toLowerCase().includes(phrase)) color = "F75853";
	}
	for (let phrase of yesPhrases) {
		if (answers[random].toLowerCase().includes(phrase)) color = "32E6C5";
	}
	let name = message.member.displayName || message.author.username;
	message.channel.send(
		new MessageEmbed()
			.setTitle("Magic 8 Ball")
			.setDescription(answers[random])
			.setColor(color)
			.setFooter(args.join(" ") + " | " + name)
	);
}
