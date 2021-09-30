import { Message } from "discord.js";
import serverModel from "../models/serverSchema";
import { ServerData } from "../types";
import filter from "leo-profanity";
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
	"sacc",
	"retard",
	"retarded",
]);
filter.remove(["suck", "sucks"]);

export default async (message: Message) => {
	if (!message.guild) return;
	const server: ServerData = await serverModel.findOne({
		serverID: message.guild.id,
	});
	if (server.clean) {
		if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return;
		if (filter.check(message.content)) message.delete();
	}
};
