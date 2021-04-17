import profileModel from "../../models/profileSchema";

export const name = "set";
export const description = "Set a birthday for your account";
export const usage = "!set birthday <birthday: format: January 23, 2010>";
export async function execute(message, args) {
	if (args[0] == "birthday") {
		let bday = "";
		for (let i = 1; i < args.length; i++) {
			bday += args[i] + " ";
		}
		await profileModel.findOneAndUpdate(
			{ userID: message.author.id },
			{
				birthday: bday,
			}
		);
		message.channel.send(`Birthday set to ${bday}`);
	}
}
