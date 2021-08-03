module.exports = {
	description: "[OWNER ONLY] Makes Minco penguin leave the server",
	async run(message) {
		if (message.author.id == "724786310711214118") {
			let msg = await message.channel.send(
				`Leaving ${message.guild.name}. React with a ✅ to continue.`
			);
			const filter = (reaction, user) => user.id === message.author.id;
			msg.react("✅").catch(console.error);
			msg
				.awaitReactions(filter, {
					time: 5000,
				})
				.then((reaction, user) => {
					message.channel.send("Leaving...");
					message.guild.leave();
				});
		}
	},
};
