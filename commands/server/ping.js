const prettyMs = require("pretty-ms");
const Discord = require("discord.js");

module.exports = {
	description: "check if the bot is online",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	execute(message, args, _1, client) {
		var status = Math.round(client.ws.ping) > 400 ? "lagging" : "online";
		var color = status == "lagging" ? "E74C3C" : "32E6C5";
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(color)
			.setAuthor(message.member.nickname || message.author.username, message.author.avatarURL())
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: prettyMs(Date.now() - message.createdTimestamp),
				},
				{ name: "Client Latency", value: prettyMs(Math.round(client.ws.ping)) },
				{ name: "Client Uptime", value: prettyMs(client.uptime) }
			)
			.setTimestamp();
		message.channel.send(pingEmbed);
		if (args[0] == "all")
			(async () => {
				let pings = [];
				pings.push(await message.channel.send(">ping"));
				pings.push(await message.channel.send("+ping"));
				pings.push(await message.channel.send("=ping"));
				pings.push(await message.channel.send("mo ping"));

				pings.forEach((ping) => ping.delete());
			})();
	},
};
