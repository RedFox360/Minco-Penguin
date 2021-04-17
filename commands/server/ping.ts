import * as prettyMs from "pretty-ms";
import * as Discord from "discord.js";

name: "ping";
export const aliases = ["p"];
export const description = "check if the bot is online";
/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */
export function execute(message, _0, _1, client) {
	var status = Math.round(client.ws.ping) > 200 ? "lagging" : "online";
	var color = status == "lagging" ? "ff0000" : "32E6C5";
	let pingEmbed = new Discord.MessageEmbed()
		.setTitle(":robot_face: Pong!")
		.setColor(color)
		.addFields(
			{ name: "Status:", value: status },
			{
				name: "Execution Time:",
				value: `${Date.now() - message.createdTimestamp}ms`,
			},
			{ name: "Client Latency", value: `${Math.round(client.ws.ping)}ms` },
			{ name: "Client Uptime", value: prettyMs(client.uptime) }
		);
	message.channel.send(pingEmbed);
}
