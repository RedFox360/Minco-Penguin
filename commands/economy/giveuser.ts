import profileModel from "../../models/profileSchema";

export const name = "giveuser";
export const description = "[ADMIN ONLY] give a user an amount of Minco Dollars";
export const usage = "!giveuser <@user> <number>";
export async function execute(message, args, cmd, client, profileData) {
	if (message.author.id == "724786310711214118") {
		const mention = message.mentions.users.first();
		if (!mention) return message.channel.send("Mention a valid user");
		const amount = parseInt(args[1]);
		if (isNaN(amount)) return message.channel.send("Enter a valid number");
		await profileModel.findOneAndUpdate(
			{ userID: mention.id },
			{
				$inc: {
					mincoDollars: amount,
				},
			}
		);
		message.channel.send(`You have given <@${mention.id}> ${amount} Minco Dollars`);
	}
}
