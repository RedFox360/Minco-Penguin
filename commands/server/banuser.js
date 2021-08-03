const serverModel = require("../../models/serverSchema");
module.exports = {
	description: "[OWNER ONLY] Ban a user from using Minco Penguin\nUnban: unban a user",
	aliases: ["unban"],
	usage: "!banuser <@user>",
	async run(message, _, cmd) {
		if (message.author.id == "724786310711214118") {
			let guildData = serverModel.findOne({ serverID: message.guild.id });
			let bannedPeople = new Array(guildData.bannedPeople);
			const mention = message.mentions.users.first();
			if (!mention) return message.reply("mention a valid user");
			if (cmd === "banuser") {
				bannedPeople.push(mention.id);
				message.channel.send(`<@${mention.id}> has been banned from Minco Penguin.`);
			} else {
				for (let i = 0; i < bannedPeople.length; i++) {
					if (bannedPeople[i] === 5) {
						bannedPeople.splice(i, 1);
					}
				}
				message.channel.send(`<@${mention.id}> has been unbanned from Minco Penguin.`);
			}
			await serverModel.findOneAndUpdate(
				{ serverID: message.guild.id },
				{
					bannedPeople: bannedPeople,
				}
			);
		}
	},
};
