const Discord = require("discord.js");

const profileModel = require("../models/profileSchema");
const serverModel = require("../models/serverSchema");

const ordinal = require("ordinal");

/** @param {Discord.GuildMember} member */
module.exports = async (client, member) => {
	let profileData = await profileModel.findOne({ userID: member.id });
	let serverData = await serverModel.findOneAndUpdate(
		{ serverID: member.guild.id },
		{
			$inc: {
				memberCount: +member.user.bot,
			},
		},
		{
			new: true,
		}
	);
	if (member.user.bot) {
		if (serverData.botRole) member.roles.add(serverData.botRole);
		return;
	}
	if (serverData.mainRole) member.roles.add(serverData.mainRole);
	if (serverData.silenceJoins) return;
	if (!profileData) {
		let profile = await profileModel.create({
			userID: member.id,
			mincoDollars: 100,
			bank: 0,
			orbs: 0,
		});
		profile.save();
	}
	const { welcomeMessage, welcomeDM, memberCount } = serverData;
	const memberCountOrdinal = ordinal(memberCount);

	let joinEmbed = new Discord.MessageEmbed()
		.setColor("58D68D") // green
		.setTitle("Welcome")
		.setDescription(
			welcomeMessage
				.replace(/\{server\}/g, member.guild.name)
				.replace(/\{mention\}/g, `<@${member.id}>`)
				.replace(/\{ord_member_count\}/g, memberCountOrdinal)
				.replace(/\{member_count\}/g, memberCount)
				.replace(/\{user\}/g, member.user.username)
				.replace(/\{user_tag\}/g, member.user.tag)
		)
		.setThumbnail(member.user.avatarURL());
	const channel = serverData.welcomeChannel
		? client.channels.cache.get(serverData.welcomeChannel)
		: member.guild.systemChannel;
	channel.send(joinEmbed);
	if (welcomeDM)
		member.send(
			welcomeDM
				.replace(/\{server\}/g, member.guild.name)
				.replace(/\{mention\}/g, `<@${member.id}>`)
				.replace(/\{ord_member_count\}/g, memberCountOrdinal)
				.replace(/\{member_count\}/g, memberCount)
				.replace(/\{user\}/g, member.user.username)
				.replace(/\{user_tag\}/g, member.user.tag)
		);
};
