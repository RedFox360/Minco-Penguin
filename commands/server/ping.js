const prettyMs = require("pretty-ms");
const Discord = require("discord.js");

module.exports = {
	description: "check if the bot is online",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	execute(message, args, _1, client) {
		var status = Math.round(client.ws.ping) > 200 ? "lagging" : "online";
		var color = status == "lagging" ? "ff0000" : "32E6C5";
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(color)
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: `${Date.now() - message.createdTimestamp}ms`,
				},
				{ name: "Client Latency", value: `${Math.round(client.ws.ping)}ms` },
				{ name: "Client Uptime", value: prettyMs(client.uptime) }
			);
		message.channel.send(pingEmbed);
		if (args[0] == "all")
			(async () => {
				let pings = [];
				pings.push(await message.channel.send(">ping"));
				pings.push(await message.channel.send("+ping"));
				pings.push(await message.channel.send("=ping"));
				pings.push(await message.channel.send("mo ping"));

				setTimeout(() => {
					pings.forEach((ping) => ping.delete());
				}, 2000);
			})();
	},
};
