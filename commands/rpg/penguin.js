const { MessageEmbed } = require("discord.js");

module.exports = {
	description: "Adopt a penguin!",
	execute(message, args) {
		if (!args.length) {
			const adoptEmbed = new MessageEmbed().setTitle("Adopt a penguin!").setDescription(
				`Adopting a penguin will allow you to participate in battles and other rpg features

Use !adopt <type> to adopt a penguin

** ** ** ** ** ** \`Warrior | Magician | Healer | Archer \`
:fire:      \`50\`              \`35\`              \`30\`              \`40\`
:crossed_swords:      \`30\`              \`50\`              \`30\`              \`25\`
:heart:      \`45\`              \`35\`              \`70\`              \`35\`
:skull_crossbones:      \`25\`              \`30\`              \`20\`              \`50\`
`
			);
			message.channel.send(adoptEmbed);
		}
	},
};