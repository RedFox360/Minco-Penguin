const { MessageEmbed } = require("discord.js");
module.exports = {
	description: "Returns the states and capitals\nCredit to Aiden for the idea",
	aliases: ["states-and-capitals", "s-and-c", "state-cap", "states-capitals"],
	usage: "!sac (west/midwest/south/northeast)",
	execute(message, args) {
		const embed = new MessageEmbed().setTitle(":flag_us: States & Capitals of the US").setColor("#43426B");

		const west = `Olympia, Washington
Salem, Oregon
Sacramento, California
Juneau, Alaska
Honolulu, Hawaii
Boise, Idaho
Helene Montana
Cheyenne, Wyoming
Carson City, Nevada
Salt Lake City, Utah
Denver, Colorado
Phoenix, Arizona,
Santa Fe, New Mexico`;
		const midwest = `Bismarck, North Dakota
Pierre, South Dakota
St Paul, Minnesota
Madison, Wisconsin
Lansing, Michigan
Lincoln, Nebraska
Topeka, Kansas
Des Moines, Iowa
Jefferson City, Missouri
Springfield, Illionois
Indianapolis, Indiana
Columbus, Ohio`;
		const south = `Austin, Texas
Oklahoma City, Oklahoma
Little Rock, Arkansas,
Baton Rouge, Louisiana
Jackson, Mississippi
Montgomery, Alabama,
Tallahassee, Florida
Atlanta, Georgia
Nashville, Tennessee
Frankfort, Kentucky
Richmond, Virginia
Raleigh, North Carolina
Columbia, South Carolina,
Charleston, West Virginia
Dover, Delaware
Annapolis, Maryland`;
		const northeast = `Augusta, Maine
Concord, New Hampshire
Montpelier, Vermont
Boston, Massachusetts
Hartford, Connecticut
Providence, Rhode Island
Albany, New York
Trenton, New Jersey
Harrisburg, Pennsylvania`;

		if (args[0] == "west") {
			embed.setDescription(west);
		} else if (args[0] == "midwest") {
			embed.setDescription(midwest);
		} else if (args[0] == "south") {
			embed.setDescription(south);
		} else if (args[0] == "northeast") {
			embed.setDescription(northeast);
		} else {
			embed.addFields(
				{
					name: "Western",
					value: west,
				},
				{
					name: "Midwestern",
					value: midwest,
				},
				{
					name: "Southern",
					value: south,
				},
				{
					name: "Northeastern",
					value: northeast,
				}
			);
		}
		message.channel.send(embed);
	},
};
