const { MessageEmbed } = require("discord.js");

module.exports = {
	description: "Adopt a penguin!",
	execute(message, args) {
		if (!args.length) {
			const adoptEmbed = new MessageEmbed()
				.setTitle("Adopt a penguin!")
				.setDescription(
					`Adopting a penguin will allow you to participate in battles and other rpg features

Use !adopt <type> to adopt a penguin

\` Warrior | Magician | Healer | Archer \`
:crossed_swords:\`   50   |   35   |   30   |   40   \`
:shield:\`   30   |   50   |   30   |   25   \`
:heart:\`   45   |   35   |   70   |   35   \`
:dart:\`   25   |   30   |   20   |   50   \`
`
				)
				.setColor("#9afffc")
				.setThumbnail(
					"https://cdn.discordapp.com/attachments/822253817600016454/866414690896445470/pixil-frame-0_5.png"
				);
			message.channel.send(adoptEmbed);
		}
	},
};
