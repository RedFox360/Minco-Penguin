const filter = require("leo-profanity");
filter.remove(["suck", "sucks"]);

const removeComments = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
const argumentNames = /([^\s,]+)/g;
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
	let serverData;
	try {
		serverData = await serverModel.findOne({ serverID: message.guild.id });
		if (!serverData) {
			let serverProfile = await serverModel.create({
				serverID: message.guild.id,
				bannedPeople: [],
				blacklist: [],
			});
			serverProfile.save();
		}
	} catch (err) {
		// error occured in DM
	}
	try {
		if (serverData.clean && message.guild.me.hasPermission("MANAGE_MESSAGES")) {
			if (filter.check(message.content)) {
				message.delete().catch();
			}
		}
	} catch (err) {
		// error occured in DM
	}
	if (message.author.bot) return;
	const prefixes = serverData?.prefixes ?? ["!"];

	if (message.content == "<@!725917919292162051>") {
		let showPrefixes = prefixes.map((prefix) => "`" + prefix + "`");
		showPrefixes.push("<@!725917919292162051>");
		let infoEmbed = new Discord.MessageEmbed()
			.setColor("32E6C5")
			.setTitle("Minco Penguin")
			.setDescription(`Prefixes: ${showPrefixes.join(", ")}`);
		message.channel.send(infoEmbed);
		return;
	}
	prefixes.push("<@!725917919292162051> ");
	const prefix = prefixes.find((p) => message.content.startsWith(p));
	if (!prefix) return;
	let profileData;
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
		}
	} catch (err) {
		console.error(err);
	}
	const args = message.content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	const command =
		client.commands.get(cmd) || client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

	if (!command) return;
	if (command.servers?.includes(message.guild.id) === false) {
		return;
	}
	try {
		if (serverData.bannedPeople) {
			for (let i = 0; i < serverData.bannedPeople.length; i++) {
				let person = serverData.bannedPeople[i];
				if (message.author.id == person) {
					return message.channel.send("You were banned from using Minco Penguin.");
				}
			}
		}
	} catch (err) {
		// error occured in DM
	}
	if (command.permissions) {
		let invalidPerms = [];
		let botInvalidPerms = [];
		for (const perm of command.permissions) {
			if (!validPermissions.includes(perm)) {
				return console.log(`Invalid Permissions ${perm}`);
			}
			if (perm == "MOD") {
				if (
					!message.member.roles.cache.has(serverData.modRole) &&
					!message.member.hasPermission("MANAGE_SERVER")
				) {
					invalidPerms.push("MOD ROLE");
				}
			} else {
				if (!message.member.hasPermission(perm)) {
					invalidPerms.push(perm);
				}
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
					msg.delete().catch();
				}, timeLeft);
			});
			setTimeout(() => {
				message.delete().catch();
			}, timeLeft + 15000);
			return;
		}
	}
	const resetCooldown = () => {
		timeStamps.delete(message.author.id);
	};
	timeStamps.set(message.author.id, currentTime);
	try {
		if (getParamNames(command.execute).includes("serverData"))
			return "This command cannot be used in DMs";
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
function getParamNames(func) {
	var fnStr = func.toString().replace(removeComments, "");
	var result = fnStr.slice(fnStr.indexOf("(") + 1, fnStr.indexOf(")")).match(argumentNames);
	if (result === null) result = [];
	return result;
}
