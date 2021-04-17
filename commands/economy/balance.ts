import { MessageEmbed, Message } from "discord.js";
import profileModel from "../../models/profileSchema";

export const name = "balance";
export const aliases = ["bal", "bl"];
export const description = "Checks the user's balance";
export const usage = "!balance (@user)";
export const cooldown = 3;
export async function execute(message: Message, _0, _1, _2, profileData) {
	const mention = message.mentions.users.first();
	if (!mention) {
		let balanceEmbed = new MessageEmbed()
			.setTitle("Balance")
			.setColor("7BFF70")
			.setDescription(`Wallet: ${profileData.mincoDollars} Minco Dollars\nBank: ${profileData.bank} Minco Dollars`);
		message.channel.send(balanceEmbed);
	} else {
		let profile: any = await profileModel.findOne({ userID: mention.id });
		let balanceEmbed = new MessageEmbed()
			.setTitle("Balance")
			.setColor("7BFF70")
			.setDescription(`Wallet: ${profile.mincoDollars} Minco Dollars\nBank: ${profile.bank} Minco Dollars`);
		message.channel.send(balanceEmbed);
	}
}
