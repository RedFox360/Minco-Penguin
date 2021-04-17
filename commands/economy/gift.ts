import { Message } from "discord.js";
import profileModel from "../../models/profileSchema";

export const name = "gift";
export const description = "Gift an amount of coins to a user";
export const usage = "!gift <@user> <number>";
export const cooldown = 3;
export async function execute(message: Message, args, _0, _1, profileData) {
	const mention = message.mentions.users.first();
	if (!mention) return "Mention a valid user";
	const amount = parseInt(args[1]);
	if (isNaN(amount)) return "Enter a valid number";
	if (amount <= 0) return "You must gift a positive integer";
	if (amount > profileData.mincoDollars) return `You don't have ${amount} dollars`;
	const userData = await profileModel.findOne({ userID: mention.id });
	if (!userData) {
		let profile = await profileModel.create({
			userID: mention.id,
			serverID: message.guild.id,
			mincoDollars: 100,
			bank: 0,
		});
		profile.save();
	}
	await profileModel.findOneAndUpdate(
		{ userID: message.author.id },
		{
			$inc: {},
		}
	);
	await profileModel.findOneAndUpdate(
		{ userID: mention.id },
		{
			$inc: {
				mincoDollars: amount,
			},
		}
	);
	message.channel.send(`You gifted ${amount} Minco Dollars to <@${mention.id}>`);
}
