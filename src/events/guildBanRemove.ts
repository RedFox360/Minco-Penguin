import serverModel from "../models/serverSchema";
import { Guild, User } from "discord.js";
export default async (guild: Guild, user: User) => {
	if (user.bot) return;
	const serverData = await serverModel.findOneAndUpdate(
		{ serverID: guild.id },
		{ $inc: { memberCount: 1 } }
	);
	if (serverData.silenceBans) return;
	user.send(`${user.tag}, you were unbanned from ${guild.name}.`);
};
