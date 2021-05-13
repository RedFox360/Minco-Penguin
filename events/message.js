const cooldowns = new Map();
const profileModel = require("../models/profileSchema");
const serverModel = require("../models/serverSchema");
const Discord = require("discord.js");
const prettyMs = require("pretty-ms");
/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */
module.exports = async (client, message) => {
	if (message.author.bot) return;
	let profileData, guildData;
	try {
		if (message.guild) {
			profileData = await profileModel.findOne({ userID: message.author.id });
			if (!profileData) {
				let profile = await profileModel.create({
					userID: message.author.id,
					serverID: message.guild.id,
					mincoDollars: 100,
					bank: 0,
					birthday: "This user's birthday has not been added to the database",
				});
				profile.save();
			}
			guildData = await serverModel.findOne({ serverID: message.guild.id });
			if (!guildData) {
				let serverProfile = await serverModel.create({
					serverID: message.guild.id,
					bannedPeople: [],
					blacklist: [],
				});
				serverProfile.save();
			}
		}
	} catch (err) {
		console.error(err);
	}
	if (message.author.id === client.user.id) return;

	if (message.content.startsWith("<@!725917919292162051>")) {
		let infoEmbed = new Discord.MessageEmbed()
			.setColor("32E6C5")
			.setTitle("Minco Penguin")
			.setDescription("Hello, I'm Minco Penguin! My prefixes are '!' and 'minco '");
		message.channel.send(infoEmbed);
		return;
	}
	var prefixes = ["!", "###", "minco "];
	var count = 0;
	var currentPrefix;
	for (let i = 0; i < prefixes.length; i++) {
		let prefix = prefixes[i];
		if (message.content.startsWith(prefix)) {
			currentPrefix = prefix;
			break;
		} else count++;
		if (count == prefixes.length) return;
	}
	const args = message.content.slice(currentPrefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	const command = client.commands.get(cmd) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

	if (!command) return;
	if (guildData.bannedPeople) {
		for (let i = 0; i < guildData.bannedPeople.length; i++) {
			let person = guildData.bannedPeople[i];
			if (message.author.id == person) {
				return "You were banned from using Minco Penguin.";
			}
		}
	}
	if (!cooldowns.has(command.description)) cooldowns.set(command.description, new Discord.Collection());
	const currentTime = Date.now();
	const timeStamps = cooldowns.get(command.description);
	const cooldownAmount = (command.cooldown || 2) * 1000;

	if (timeStamps.has(message.author.id)) {
		const expTime = timeStamps.get(message.author.id) + cooldownAmount;
		if (currentTime < expTime) {
			const timeLeft = expTime - currentTime;
			let timeEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Cooldown")
				.setDescription(`Please wait ${prettyMs(timeLeft)} before using command ${cmd}`);
			message.channel.send(timeEmbed).then((msg) => {
				setTimeout(() => {
					msg.delete();
				}, timeLeft);
			});
			setTimeout(() => {
				message.delete();
			}, timeLeft + 2000);
			return;
		}
	}
	timeStamps.set(message.author.id, currentTime);
	try {
		const t = command.execute(message, args, cmd, client, profileData);
		if (typeof t === "string") message.channel.send(t);
		if (t instanceof Promise) {
			const toSend = await t;
			if (typeof toSend === "string") message.channel.send(toSend);
		}
	} catch (error) {
		message.react("❌");
		message.channel.send("An error occured while trying to execute this command");
		console.error(error);
	}
};
