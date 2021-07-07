const cooldowns = new Map();
const validPermissions = require("../functions/permissions.json");
const profileModel = require("../models/profileSchema");
const serverModel = require("../models/serverSchema");
const Discord = require("discord.js");
const prettyMs = require("pretty-ms");
const ms = require("ms");
/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */
module.exports = async (client, message) => {
	if (message.author.bot) return;
	if (message.content.startsWith("<@!725917919292162051>")) {
		let infoEmbed = new Discord.MessageEmbed()
			.setColor("32E6C5")
			.setTitle("Minco Penguin")
			.setDescription("Hello, I'm Minco Penguin! My prefixes are '!' and 'minco '");
		message.channel.send(infoEmbed);
		return;
	}
	let prefixes = ["!", "###", "minco "];
	let count = 0;
	let currentPrefix;
	for (const prefix of prefixes) {
		if (message.content.startsWith(prefix)) {
			currentPrefix = prefix;
			break;
		} else count++;
		if (count == prefixes.length) return;
	}
	let profileData, serverData;
	try {
		if (message.guild) {
			profileData = await profileModel.findOne({ userID: message.author.id });
			if (!profileData) {
				let profile = await profileModel.create({
					userID: message.author.id,
					serverID: message.guild.id,
					mincoDollars: 100,
					bank: 0,
					orbs: 0,
					birthday: "This user's birthday has not been added to the database",
				});
				profile.save();
			}
			serverData = await serverModel.findOne({ serverID: message.guild.id });
			if (!serverData) {
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
	const args = message.content.slice(currentPrefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	const command =
		client.commands.get(cmd) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

	if (!command) return;
	if (command.servers?.includes(message.guild.id) === false) {
		return;
	}
	if (serverData.bannedPeople) {
		for (let i = 0; i < serverData.bannedPeople.length; i++) {
			let person = serverData.bannedPeople[i];
			if (message.author.id == person) {
				return message.channel.send("You were banned from using Minco Penguin.");
			}
		}
	}
	if (command.permissions.length) {
		let invalidPerms = [];
		let botInvalidPerms = [];
		for (const perm of command.permissions) {
			if (!validPermissions.includes(perm)) {
				return console.log(`Invalid Permissions ${perm}`);
			}
			if (!message.member.hasPermission(perm)) {
				invalidPerms.push(perm);
			}
			if (!message.guild.me.hasPermission(perm)) {
				botInvalidPerms.push(perm);
			}
		}
		if (invalidPerms.length) {
			return message.channel.send(
				`You need these permissions to execute this command: \`${invalidPerms}\``
			);
		}
		if (botInvalidPerms.length) {
			return message.channel.send(
				`The bot needs these permissions to execute this command: \`${botInvalidPerms}\``
			);
		}
	}
	if (!cooldowns.has(command.description))
		cooldowns.set(command.description, new Discord.Collection());
	const currentTime = Date.now();
	const timeStamps = cooldowns.get(command.description);
	const cooldown = command.cooldown;
	const cooldownAmount = typeof cooldown === "string" ? ms(cooldown) : (cooldown || 2) * 1000;

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
			}, timeLeft + 15000);
			return;
		}
	}
	const resetCooldown = () => {
		timeStamps.delete(message.author.id);
	};
	timeStamps.set(message.author.id, currentTime);
	try {
		const t = command.execute(message, args, cmd, client, profileData, serverData);
		if (typeof t === "string") sendC(message, t, resetCooldown);
		if (t instanceof Promise) {
			t.then((toSend) => {
				if (typeof toSend === "string") sendC(message, toSend, resetCooldown);
			});
		}
	} catch (error) {
		message.react("❌");
		message.channel.send("An error occured while trying to execute this command");
		console.error(error);
	}
};

function sendC(message, info, resetCooldown) {
	message.channel.send(info);
	if (info.includes("valid") || info.includes("enter")) {
		resetCooldown();
	}
}
