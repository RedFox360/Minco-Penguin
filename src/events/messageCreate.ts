import { Message } from "discord.js";
import serverModel from "../models/serverSchema";
import { ServerData } from "../types";
import filter from "leo-profanity";
import profileInServerModel from "../models/profileInServerSchema";
filter.add([
	"fucked",
	"fuced",
	"fuc",
	"fuq",
	"stfu",
	"feck",
	"fawk",
	"shet",
	"betch",
	"cocaine",
	"heroin",
	"retard",
	"retarded",
]);
filter.remove(["suck", "sucks", "butt"]);

export default async (message: Message) => {
	if (!message.guild || !message.author) return;
	if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return;
	const server: ServerData = await serverModel.findOne({
		serverID: message.guild.id,
	});
	if (
		server.clean &&
		(filter.check(
			message.content.replaceAll(/[!@#$%^&*()-+/.,;'~`=_><?{}|]/g, "")
		) ||
			message.content.includes("middle_finger"))
	) {
		await message.delete();
		return;
	}
	const profile = await profileInServerModel.findOne({
		userID: message.author.id,
		serverID: message.guild.id,
	});
	if (profile?.isShadowBanned) {
		await message.delete();
	}
};
