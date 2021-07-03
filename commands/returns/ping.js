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
		const exec = msg.createdTimestamp - message.createdTimestamp;
		const latency = Math.round(client.ws.ping);
		const total = exec+latency;
		let pingEmbed = new Discord.MessageEmbed()
			.setTitle(":robot_face: Pong!")
			.setColor(rgbToHex(total < 250 ? 0 : ping), 455 - ping, 0)
			.setAuthor(message.member.displayName, message.author.avatarURL())
			.addFields(
				{ name: "Status:", value: status },
				{
					name: "Execution Time",
					value: prettyMs(exec),
				},
				{ name: "Client Latency", value: prettyMs(latency) },
				{ name: "Total", value: prettyMs(total) }
			)
			.setFooter(message.guild.name)
			.setTimestamp();
		msg.delete();
		message.channel.send(pingEmbed);
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
function componentToHex(c) {
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
	return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}