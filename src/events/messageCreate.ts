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
	":middle_finger:",
]);
filter.remove(["suck", "sucks", "butt"]);

export default async (message: Message) => {
	if (!message.guild) return;
	if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return;
	const server: ServerData = await serverModel.findOne({
		serverID: message.guild.id,
	});
	if (server.clean) {
		if (filter.check(message.content)) await message.delete();
	}
	if (!message.author || !message.guild) return;
	const profile = await profileInServerModel.findOne({
		userID: message.author.id,
		serverID: message.guild.id,
	});
	if (profile?.isShadowBanned) {
		await message.delete();
	}
};
