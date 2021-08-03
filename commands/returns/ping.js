const prettyMs = require("pretty-ms");
const Discord = require("discord.js");

module.exports = {
	description: "check if the bot is online",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async run(message, args, _1, client) {
		const msg = await message.channel.send("pong!");
		const latency = Math.round(client.ws.ping);
		const ping = msg.createdTimestamp - message.createdTimestamp;

		const [status, color] = (() => {
			if (ping <= 500) return ["online", "#48C9B0"];
			else if (ping <= 2000) return ["slightly lagging", "#F7DC6F"];
			else if (ping <= 7000) return ["lagging", "FF9433"];
			else return ["severely lagging", "#E74C3C"];
		})();
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(color)
			.setAuthor(message.authorName(), message.author.avatarURL())
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: prettyMs(ping),
				},
				{ name: "Client Latency", value: prettyMs(latency) },
				{ name: "Total", value: prettyMs(latency + ping) },
				{ name: "Client Uptime", value: prettyMs(client.uptime) }
			)
			.setTimestamp();
		if (message.guild) pingEmbed.setFooter(message.guild.name);
		msg.delete();
		message.channel.send(pingEmbed);
	},
};
