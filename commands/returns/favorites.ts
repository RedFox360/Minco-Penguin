import profileModel from "../../models/profileSchema";

import { Message } from "discord.js";

export const name = "favorites";
export const description = "Check the favorites of a user";
export const usage = "!favorites <@user>";
export async function execute(message) {
	const mention = message.mentions.users.first();
	if (!mention) return message.channel.send("Mention a valid user");
	let profile: any = await profileModel.findOne({ userID: mention.id });
	try {
		message.channel.send("Animal: " + profile.favs.animal);
		message.channel.send("Color: " + profile.favs.color);
		message.channel.send("Food: " + profile.favs.food);
	} catch (err) {
		console.error(err);
	}
}
