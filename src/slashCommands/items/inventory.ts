import { MessageEmbed } from "discord.js";
import { CommandData } from "../../types";

export const data = {
	name: "inventory",
	description: "View your inventory",
	options: [
		{
			name: "user",
			description: "The user to view the inventory of",
			type: "USER",
			required: false,
		},
	],
};

export async function run({ interaction, profileOf }: CommandData) {
	const userExists = interaction.options.getUser("user");
	const user = userExists ?? interaction.user;
	const { inventory } = await profileOf(user.id);
	if (!inventory.length) {
		await interaction.reply(
			`${
				userExists ? `${user.toString()} doesn't` : "You don't"
			} have any items in ${userExists ? "their" : "your"} inventory.`
		);
		return;
	}

	const inv = inventory
		.map((t) => {
			if (t == "01") return ":ring: Marriage Ring";
			if (t == "02") return ":diamond_shape_with_a_dot_inside: Diamond Crown";
			if (t == "03") return ":cowboy: Cowboy Hat";
			if (t == "04") return ":tomato: Tomato";
			if (t == "05") return ":candy: Candy";
			if (t == "06")
				return `<:transparent_jellybot:833491227995013130> Jellyfish`;
			if (t == "07") return ":bear: Bear";
			if (t == "08") return ":cactus: Cactus";
			if (t == "09") return ":fire: Fire";
			if (t == "10") return "<:cardboard_box:843173235549667349> Lootbox";
			if (t == "11") return ":egg: Raw Egg";
			if (t == "11-00.") return ":egg: Boiled Egg";
			if (t == "11-1") return ":egg: Scrambled Eggs";
			if (t == "11-2") return ":egg: Omelette";
			if (t == "12") return ":banana: Banana";
		})
		.map((t, i) => `${i + 1}. ${t}`);

	const invEmbed = new MessageEmbed()
		.setAuthor("Inventory", user.avatarURL())
		.setDescription(inv.join("\n"))
		.setColor("#F8C471")
		.setFooter(interaction.guild.name);
	interaction.reply({ embeds: [invEmbed] });
}
