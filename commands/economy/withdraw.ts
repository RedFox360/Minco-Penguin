import profileModel from "../../models/profileSchema";

export const name = "withdraw";
export const aliases = ["wd"];
export const description = "Withdraw coins from your bank";
export const cooldown = 5;
export const usage = "!withdraw <number>";
export async function execute(message, args, cmd, client, profileData) {
	const amount = parseInt(args[0]);
	if (isNaN(amount)) return message.channel.send("Enter a valid number");
	if (amount % 1 != 0 || amount <= 0) return message.channel.send("Withdraw amount must be a whole number");
	try {
		if (amount > profileData.bank) return message.channel.send("You don't have that amount of Minco Dollars in your bank.");
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				$inc: {
					mincoDollars: amount,
					bank: -amount,
				},
			}
		);
	} catch (err) {
		console.error(err);
	}
	message.channel.send(`You withdrawed ${amount} Minco Dollars.`);
}
