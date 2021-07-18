const { MessageEmbed } = require("discord.js");

module.exports = {
	description: "Adopt a penguin!",
	execute(message, args) {
		if (!args.length) {
			const adoptEmbed = new MessageEmbed().setTitle("Adopt a penguin!").setDescription(
				`Adopting a penguin will allow you to participate in battles and other rpg features

Use !adopt <type> to adopt a penguin

\`Warrior | Magician | Healer | Archer \`
:fire:${"\u200B".repeat(6)}\`50\`${"\u200B".repeat(14)}\`35\`${"\u200B".repeat(
					14
				)}\`30\`${"\u200B".repeat(14)}\`40\`
:crossed_swords:      \`30\`${"\u200B".repeat(14)}\`50\`${"\u200B".repeat(
					14
				)}\`30\`${"\u200B".repeat(14)}\`25\`
:heart:      \`45\`${"\u200B".repeat(14)}\`35\`${"\u200B".repeat(14)}\`70\`${"\u200B".repeat(
					14
				)}\`35\`
:skull_crossbones:      \`25\`${"\u200B".repeat(14)}\`30\`${"\u200B".repeat(
					14
				)}\`20\`${"\u200B".repeat(14)}\`50\`
`
			);
			message.channel.send(adoptEmbed);
		}
	},
};
