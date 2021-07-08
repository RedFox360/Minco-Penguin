module.exports = {
	description: "[ONWER ONLY] view all the servers Minco is in",
	execute(message, _0, _1, client) {
		if (message.author.id == "724786310711214118") {
			let servers = client.guilds.cache.map((guild) => guild.name).join("\n");
			message.channel.send("```\n" + servers + "\n```");
		}
	},
};
