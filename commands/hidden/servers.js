const { Client } = require("discord.js");
module.exports = {
	description: "[ONWER ONLY] view all the servers Minco is in",
	/** @param {Client} client */
	run(message, _0, _1, client) {
		if (message.author.id == "724786310711214118") {
			let servers = client.guilds.cache
				.array()
				.map((guild, index) => `${index + 1}. ${guild.name}`)
				.join("\n");
			message.channel.send(`\`\`\`md
# Minco Penguin Servers

${servers}
\`\`\``);
		}
	},
};
