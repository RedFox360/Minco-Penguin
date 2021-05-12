module.exports = {
	description: "View your item inventory! (from shop)",
	aliases: ["inv"],
	execute(message, _0, _1, _2, profileData) {
		if (!profileData.inventory.length) return "You don't have any items in your inventory.";
		const inventory = profileData.inventory.map((t) => {
			if (t == "01") return ":ring: Marriage Ring";
			if (t == "02") return ":diamond_shape_with_a_dot_inside: Diamond Crown";
			if (t == "03") return ":cowboy: Cowboy Hat";
			if (t == "04") return ":tomato: Tomato";
			if (t == "05") return ":candy: Candy";
			if (t == "06") return `<:transparent_jellybot:833491227995013130> Jellyfish`;
		});
		for (let i = 0; i < inventory.length; i++) {
			inventory[i] = `${i + 1}. ${inventory[i]}`;
		}
		message.channel.send(inventory.join("\n"));
	},
};
