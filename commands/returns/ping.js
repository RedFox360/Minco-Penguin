const prettyMs = require("pretty-ms");
const Discord = require("discord.js");

module.exports = {
	description: "check if the bot is online",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async execute(message, args, _1, client) {
		const msg = await message.channel.send("pong!");
		const latency = Math.round(client.ws.ping);
		const ping = msg.createdTimestamp - message.createdTimestamp;
		const exec = ping - latency;

		const [status, color] = (() => {
			if (ping <= 500) return ["online", "#48C9B0"];
			else if (ping <= 2000) return ["slightly lagging", "#F7DC6F"];
			else if (ping <= 7000) return ["lagging", "FF9433"];
			else return ["severely lagging", "#E74C3C"];
		})();
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(color)
			.setAuthor(message.member.displayName, message.author.avatarURL())
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: prettyMs(exec),
				},
				{ name: "Client Latency", value: prettyMs(latency) },
				{ name: "Total", value: prettyMs(ping) },
				{ name: "Client Uptime", value: prettyMs(client.uptime) }
			)
			.setFooter(message.guild.name)
			.setTimestamp();
		msg.delete().catch();
		message.channel.send(pingEmbed);
	},
};
