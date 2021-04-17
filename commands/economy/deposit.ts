import profileModel from "../../models/profileSchema";

export const name = "deposit";
export const aliases = ["dep"];
export const description = "Despoit coins into your bank";
export const usage = "!deposit <number>";
export const cooldown = 5;
export async function execute(message, args, _0, _1, profileData) {
	const amount = parseInt(args[0]);
	if (isNaN(amount)) return "Enter a valid number";
	if (amount % 1 != 0 || amount <= 0) return "Deposit amount must be a whole number";
	try {
		if (amount > profileData.mincoDollars) return "You don't have that amount of Minco Dollars to deposit.";
		await profileModel.findOneAndUpdate(
			{
				userID: message.author.id,
			},
			{
				$inc: {
					mincoDollars: -amount,
					bank: amount,
				},
			}
		);
	} catch (err) {
		console.error(err);
	}
	message.channel.send(`You deposited ${amount} Minco Dollars into your bank.`);
}
