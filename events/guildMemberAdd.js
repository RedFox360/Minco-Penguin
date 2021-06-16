const Discord = require("discord.js");

const profileModel = require("../models/profileSchema");
const serverModel = require("../models/serverSchema");

const ordinal = require("ordinal");

/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	if (member.user.bot) return;
	let profileData = await profileModel.findOne({ userID: member.id });
	let serverData = await serverModel.findOne({ serverID: member.guild.id });
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

	var memberCount = member.guild.memberCount;
	var memberCountOrdinal = ordinal(memberCount);

	let joinEmbed = new Discord.MessageEmbed()
		.setColor("58D68D") // green
		.setTitle("Welcome")
		.setDescription(
			`Welcome to ${member.guild.name}, <@${member.id}>!\nYou are the ${memberCountOrdinal} member!`
		)
		.setThumbnail(member.user.avatarURL());
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(joinEmbed);
	member.send(
		`Welcome to ${member.guild.name}, <@${member.id}>! You are the ${memberCountOrdinal} member!`
	);
};
