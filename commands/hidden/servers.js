module.exports = {
	description: "[ONWER ONLY] view all the servers Minco is in",
	execute(message, _0, _1, client) {
		let servers = client.guilds.cache.map((guild) => guild.name).join("\n");
		message.channel.send("```\n" + servers + "\n```");
	},
};
