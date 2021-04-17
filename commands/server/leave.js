module.exports = {
	name: "leave",
	description: "[SAMEER ONLY] Makes Minco penguin leave the server",
	async execute(message) {
		if (message.author.id == "724786310711214118") {
			let msg = await message.channel.send(`Leaving ${message.guild.name}. React with a ✅ to continue.`);
			message.guild.leave();
			const filter = (reaction, user) => user.id === message.author.id;
			msg.react("✅").catch(console.error);
			const collector = await msg.createReactionCollector(filter, {
				time: 5000,
			});
			collector.on("collect", (reaction, user) => {
				message.channel.send("Leaving...");
				message.guild.leave();
			});

			collector.on("end", (collected) => {
				message.channel.send("Timed out. Canceling...");
			});
		}
	},
};
