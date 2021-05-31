const { Client } = require("discord.js");
const { readFileSync } = require("fs");
/** @param {Client} client */
module.exports = (client) => {
	const status = readFileSync("../functions/status.txt").toString().split("\n");
	console.log(`${client.user.tag} is online!`);
	client.user.setActivity(status[1], { type: status[0] });
	client.user.setActivity({
		type: "",
	});
};
