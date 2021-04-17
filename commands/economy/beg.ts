import profileModel from "../../models/profileSchema";

export const name = "beg";
export const cooldown = 240; //4 minutes
export const aliases = ["gimmemoney"];
export const usage = "!beg";
export const description = "Beg for Minco Dollars";
export async function execute(message, _, cmd) {
	let money = cmd === "gimmemoney" ? 2 : 4;
	let numberEcon = Math.floor(Math.random() * money) + 1;
	await profileModel.findOneAndUpdate(
		{ userID: message.author.id },
		{
			$inc: { mincoDollars: numberEcon },
		}
	);
	message.channel.send(`You received ${numberEcon} Minco Dollars!`);
}
