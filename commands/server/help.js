const Discord = require("discord.js");

const fs = require("fs");
const ms = require("ms");
module.exports = {
	description: "Help for all Minco Penguin commands!",
	aliases: ["c"],
	/**
	 * @param {Discord.Message} message
	 * @param {Discord.Client} client
	 */
	async run(message, args, _, client) {
		let color = "C782FE"; // light purple
		let author = [message.authorName(), message.author.avatarURL()];
		let titles = [
			"Minco Penguin Commands",
			"INFO/USEFUL Commands",
			"FUN Commands",
			"SERVER Commands",
			"RANDOM RETURN Commands",
			"RPG Commands",
			"ECONOMY Commands",
			"ITEM Commands",
		];
		let description = `Use the :arrow_left: and :arrow_right: reactions to switch between pages.
Don't put **< >** in the actual commands.
**( )** show optional arguments
**ms** means write '1m, 2 seconds, 4 days', etc.

**Categories**:
\`INFO/USEFUL Commands\`
\`FUN Commands\`
\`SERVER Commands\`
\`RANDOM RETURN Commands\`
\`RPG Commands\`
\`ECONOMY Commands\`
\`ITEM Commands\``;

		if (args.length) {
			//["items", "economy", "random", "useful", "server", "fun", "returns", "info"]
			if (
				args[0] == "items" ||
				args[0] == "economy" ||
				args[0] == "useful" ||
				args[0] == "server" ||
				args[0] == "fun" ||
				args[0] == "rpg" ||
				args[0] == "random" ||
				args[0] == "info"
			) {
				if (args[0] == "returns" || args[0] == "useful" || args[0] == "info") pos = 1;
				else if (args[0] == "fun") pos = 2;
				else if (args[0] == "server") pos = 3;
				else if (args[0] == "random") pos = 4;
				else if (args[0] == "rpg") pos = 5;
				else if (args[0] == "economy") pos = 6;
				else if (args[0] == "items") pos = 7;
				let pageEmbed = new Discord.MessageEmbed()
					.setAuthor(...author)
					.setTitle(titles[pos])
					.setColor(color);
				getFields(message)[pos].forEach((field) => {
					pageEmbed.addField(field[0], field[1]);
				});
				message.channel.send(pageEmbed);
				return;
			}
			const command =
				client.commands.get(args[0]) ||
				client.commands.find((a) => a.aliases && a.aliases.includes(args[0]));
			if (!command) return "Enter a valid command name";
			let commandEmbed = new Discord.MessageEmbed()
				.setAuthor(...author)
				.setTitle(command.usage || "!" + args[0])
				.setDescription(command.description)
				.setColor(color);
			return message.channel.send(commandEmbed);
		}
		let currentPage = 0;
		const helpEmbed = new Discord.MessageEmbed()
			.setAuthor(...author)
			.setTitle(titles[currentPage])
			.setDescription(description)
			.setColor(color)
			.setFooter(`Page ${currentPage + 1}/${titles.length}`);

		const helpMsg = await message.channel.send(helpEmbed);
		const fields = getFields(message);

		try {
			await helpMsg.react("⬅️");
			await helpMsg.react("➡️");
		} catch (err) {
			console.error(err);
		}

		const filter = (_, user) => user.id === message.author.id;
		helpMsg.awaitReactions(filter, { time: ms("4m") }).then(async (reaction) => {
			if (reaction.emoji.name == "⬅️") {
				if (currentPage != 0) currentPage--;
				if (currentPage == 0) {
					helpEmbed
						.setTitle(titles[0])
						.setDescription(description)
						.setFooter(`Page ${currentPage + 1}/${titles.length}`);
					helpEmbed.fields = [];
					helpMsg.edit(helpEmbed);
				} else {
					helpEmbed
						.setTitle(titles[currentPage])
						.setDescription("")
						.setFooter(`Page ${currentPage + 1}/${titles.length}`);
					helpEmbed.fields = [];
					fields[currentPage].forEach((field) => {
						helpEmbed.addField(field[0], field[1]);
					});
					helpMsg.edit(helpEmbed);
				}
			} else if (reaction.emoji.name == "➡️") {
				if (currentPage != titles.length - 1) currentPage++;
				helpEmbed
					.setTitle(titles[currentPage])
					.setDescription("")
					.setFooter(`Page ${currentPage + 1}/${titles.length}`);
				helpEmbed.fields = [];
				fields[currentPage].forEach((field) => {
					helpEmbed.addField(field[0], field[1]);
				});
				helpMsg.edit(helpEmbed);
			}

			const userReactions = helpMsg.reactions.cache.filter((react) =>
				react.users.cache.has(message.author.id)
			);
			try {
				for (const reaction of userReactions.values()) {
					await reaction.users.remove(message.author.id);
				}
			} catch (error) {
				console.error("Failed to remove reactions.");
			}
		});
	},
};

function getFields(message) {
	const fields = [0, [], [], [], [], [], [], []];
	const categories = fs.readdirSync("./commands/").filter((file) => !file.endsWith(".DS_Store"));
	for (const category of categories) {
		if (category != "hidden") {
			const commandFiles = fs
				.readdirSync(`./commands/${category}`)
				.filter((File) => File.endsWith(".js"));
			for (const file of commandFiles) {
				const command = require(`../../commands/${category}/${file}`);
				let pos = 0;
				if (category == "returns") pos = 1;
				else if (category == "fun") pos = 2;
				else if (category == "server") pos = 3;
				else if (category == "random") pos = 4;
				else if (category == "rpg") pos = 5;
				else if (category == "economy") pos = 6;
				else if (category == "items") pos = 7;
				if (!message.guild && command.servers) continue;
				if (command.servers?.includes(message.guild.id) === false) continue;
				if (command.usage) fields[pos].push([command.usage, command.description]);
				else fields[pos].push([`!${file.split(".")[0]}`, command.description]);
			}
		}
	}
	return fields;
}
