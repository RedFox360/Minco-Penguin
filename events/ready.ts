import { Client } from "discord.js";
module.exports = (client: Client) => {
	console.log(`${client.user.tag} is online!`);
};
