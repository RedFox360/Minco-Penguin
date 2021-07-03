const prettyMs = require("pretty-ms");
const Discord = require("discord.js");

module.exports = {
	description: "check if the bot is online",
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async execute(message, args, _1, client) {
		var status = Math.round(client.ws.ping) > 400 ? "lagging" : "online";
		var color = status == "lagging" ? "E74C3C" : "32E6C5";
		
		const msg = await message.channel.send('pong!');
		const exec = prettyMs(msg.createdTimestamp - message.createdTimestamp);
		const latency = prettyMs(Math.round(client.ws.ping));
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(color)
			.setAuthor(message.member.displayName, message.author.avatarURL())
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: exec,
				},
				{ name: "Client Latency", value: latency},
				{ name: "Total", value: exec+latency }
			)
			.setFooter(message.guild.name)
			.setTimestamp();
		msg.edit(pingEmbed);
		if (args[0] == "all") {
			let pings = [];
			pings.push(await message.channel.send(">ping"));
			pings.push(await message.channel.send("+ping"));
			pings.push(await message.channel.send("=ping"));
			pings.push(await message.channel.send("mo ping"));

			pings.forEach((ping) => ping.delete());
		}
	},
};
