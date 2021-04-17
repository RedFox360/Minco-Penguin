import * as Discord from "discord.js";
import profileModel from "../models/serverSchema";
import ordinal from "ordinal";

export default async (_, member: Discord.GuildMember) => {
	if (member.user.bot) return;
	let profileData = await profileModel.findOne({ userID: member.id });
	if (!profileData) {
		let profile = await profileModel.create({
			userID: member.id,
			serverID: member.guild.id,
			mincoDollars: 100,
			bank: 0,
			birthday: "This user's birthday has not been added to the database",
		});
		profile.save();
	}

	var memberCount = member.guild.memberCount;
	var memberCountOrdinal = ordinal(memberCount);

	let joinEmbed = new Discord.MessageEmbed()
		.setColor("58D68D") // green
		.setTitle("Welcome")
		.setDescription(`Welcome to the ${member.guild.name} server, <@${member.id}>!\nYou are the ${memberCountOrdinal} member!`);

	member.guild.systemChannel.send(joinEmbed);
	member.send(`Welcome to the ${member.guild.name} server, <@${member.id}>! You are the ${memberCountOrdinal} member!`);
};
