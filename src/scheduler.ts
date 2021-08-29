import cron from "node-cron";
import serverModel from "./models/serverSchema";
import { Client, MessageEmbed, TextChannel } from "discord.js";
import { ServerData } from "./types";
import dayjs from "dayjs";

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
				console.log(date.format());
				console.log(server.birthdays);
				const month = date.month();
				const day = date.date();
				const { birthdays, birthdayChannel } = server;
				if (!birthdays) {
					server = await serverModel.findOneAndUpdate(
						{ serverID: guild.id },
						{ birthdays: new Map() },
						{ new: true }
					);
				}
				console.log("pass 1");
				server.birthdays.forEach(async (birthday, uid) => {
					const birthdate = dayjs(birthday, server.timezone);
					if (birthdate.month() == month && birthdate.date() == day) {
						let desc = `Today is <@${uid}>'s birthday!`;
						if (birthdate.year() !== 2001) {
							desc += `\nThey are turning ${
								birthdate.year() - date.year()
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
