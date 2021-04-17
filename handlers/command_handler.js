const fs = require("fs");
module.exports = (client) => {
	const categories = fs.readdirSync("./commands/").filter((file) => !file.endsWith(".DS_Store"));
	for (const category of categories) {
		const commandFiles = fs.readdirSync(`./commands/${category}`).filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const command = require(`../commands/${category}/${file}`);
			client.commands.set(file.split(".")[0], command);
		}
	}
};
