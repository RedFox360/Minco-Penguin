const { MessageEmbed, version } = require("discord.js");
module.exports = {
	description: "sends info about the code",
	execute(message) {
		let pingEmbed = new MessageEmbed()
			.setTitle(":robot_face: Code Info")
			.setColor("70E5FF")
			.addFields(
				{ name: "Node Version", value: process.version },
				{ name: "Discord.js Version", value: "v" + version },
				{
					value: "Heroku free account, view the server [here](https://minco-penguin.herokuapp.com/)",
				},
				{
					value: "discord.js, ms, dotenv, express, fs, mongoose",
				}
			);
		message.channel.send(pingEmbed);
	},
};
