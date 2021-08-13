const { MessageEmbed, version } = require("discord.js");
const { dependencies } = require("../../../package.json");
module.exports = {
	description: "sends info about the code",
	run(message) {
		let pingEmbed = new MessageEmbed()
			.setTitle(":robot_face: Code Info")
			.setColor("70E5FF")
			.addFields(
				{ name: "Node Version", value: process.version },
				{ name: "Discord.js Version", value: "v" + version },
				{
					name: "Server",
					value:
						"Heroku free account, view the server [here](https://minco-penguin.herokuapp.com/)",
				},
				{
					name: "Packages used",
					value: Object.keys(dependencies).join(", "),
				}
			);
		message.channel.send(pingEmbed);
	},
};
