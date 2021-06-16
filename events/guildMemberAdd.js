const Discord = require("discord.js");

const profileModel = require("../models/profileSchema");
const serverModel = require("../models/serverSchema");

const ordinal = require("ordinal");

/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	if (member.user.bot) return;
	let profileData = await profileModel.findOne({ userID: member.id });
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
	if (serverData.mainRole) member.roles.add(serverData.mainRole.id);
	if (serverData.silenceJoins) return;
	if (!profileData) {
		let profile = await profileModel.create({
			userID: member.id,
			serverID: member.guild.id,
			mincoDollars: 100,
			bank: 0,
			orbs: 0,
			birthday: "This user's birthday has not been added to the database",
		});
		profile.save();
	}
	let welcomeMessage =
		serverData.welcomeMessage ??
		"Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!";
	var members = await member.guild.members.fetch();
	var memberCount = members.filter((member) => !member.user.bot).size;
	var memberCountOrdinal = ordinal(memberCount);

	welcomeMessage = welcomeMessage
		.replace(/\{server\}/g, message.guild.name)
		.replace(/\{mention\}/g, `<@${member.id}>`)
		.replace(/\{ord_member_count\}/g, memberCountOrdinal)
		.replace(/\{member_count\}/g, memberCount)
		.replace(/\{user\}/g, member.user.username)
		.replace(/\{user_tag\}/g, member.user.tag)
		.replace(/\{\}/g);
	let joinEmbed = new Discord.MessageEmbed()
		.setColor("58D68D") // green
		.setTitle("Welcome")
		.setDescription(welcomeMessage)
		.setThumbnail(member.user.avatarURL());
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(joinEmbed);
	member.send(welcomeMessage);
};
