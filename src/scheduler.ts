import cron from "node-cron";
import serverModel from "./models/serverSchema";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { ServerData } from "./types";
import dayjs from "dayjs";
import profileModel from "./models/profileSchema";

export default (client: Client) => {
	client.guilds.cache.forEach(async (guild) => {
		let server: ServerData = await serverModel.findOne({
			serverID: guild.id,
		});
		if (!server.sendBirthdays) return;
		cron.schedule(
			"0 9 * * *",
			async () => {
				const date = dayjs();
				const month = date.month();
				const day = date.date();
				const { birthdayChannel } = server;
				(await guild.members.fetch()).forEach(async (member) => {
					if (member.user.bot) return;
					const { birthday } = await profileModel.findOne({
						userID: member.id,
					});
					if (!birthday) return;
					const birthdate = dayjs(birthday, server.timezone);
					if (birthdate.month() == month && birthdate.date() == day) {
						let desc = `Today is ${member.user.toString()}'s birthday!`;
						if (birthdate.year() !== 2001) {
							desc += `\nThey are turning ${
								date.year() - birthdate.year()
							} years old!`;
						}
						const channel = birthdayChannel
							? await guild.channels.fetch(birthdayChannel)
							: guild.systemChannel;
						if (!channel) return;
						await (channel as TextChannel).send({
							embeds: [
								new MessageEmbed()
									.setTitle("🎂 Happy Birthday")
									.setDescription(desc)
									.setFooter(guild.name)
									.setColor("#ffc0cb")
									.setTimestamp(),
							],
						});
					}
				});
			},
			{ timezone: server.timezone }
		);
		console.log("finished with " + guild.name);
	});
};
