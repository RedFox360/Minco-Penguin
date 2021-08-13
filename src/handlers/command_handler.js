const { readdirSync } = require("fs");
module.exports = (client) => {
	const categories = readdirSync("./src/commands/").filter(
		(file) => !file.endsWith(".DS_Store")
	);
	for (const category of categories) {
		const commandFiles = readdirSync(`./src/commands/${category}`).filter(
			(file) => file.endsWith(".js")
		);
		for (const file of commandFiles) {
			const command = require(`../commands/${category}/${file}`);
			client.normalCommands.set(file.split(".")[0], command);
		}
	}
};
