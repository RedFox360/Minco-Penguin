import { Message } from "discord.js";
import profileModel from "../../models/profileSchema";

export const name = "birthday";
export const aliases = ["bday", "b"];
export const cooldown = 3;
export const description = "View everyone's birthday.  export const usage =  birthday <name>";
export const usage = "!birthday <@user>";
/** @param {Message} message */
export async function execute(message, args) {
	if (!args.length) return "You didn't provide any arguments.";
	const mention = message.mentions.users.first();
	if (!mention) return "Mention a valid user";
	try {
		const profile: any = await profileModel.findOne({ userID: mention.id });
		message.channel.send(profile.birthday);
	} catch (err) {
		message.channel.send("This user's birthday has not been added to the database");
	}
}
