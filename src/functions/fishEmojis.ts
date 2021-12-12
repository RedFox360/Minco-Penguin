const emojis = {
	axolotls: [
		"<:blue_axolotl:918657282781376532>",
		"<:brown_axolotl:918657282848464926>",
		"<:cyan_axolotl:918657282781368330>",
		"<:gold_axolotl:918657282831704144>",
		"<:pink_axolotl:918657282844266517>",
	],
	sparkles: [
		"<:blue_sparkle:917911870420160534>",
		"<:light_blue_sparkle:917911870575378433>",
		"<:pink_sparkle:917911870629900368>",
		"<:yellow_sparkle:917911870722170900>",
	],
	cod: "<:cod:918657282642948126>",
	salmon: "<:salmon:918657282668113950>",
	pufferfish: "<:pufferfish:918657282710069319>",
	clownfish: "<:clownfish:918657282001235979>",
	cookedCod: "<:cooked_cod:919306796156473426>",
	cookedSalmon: "<:cooked_salmon:919306796374585414>",
	get axolotl(): string {
		return this.axolotls[Math.floor(Math.random() * 5)];
	},
	get sparkle(): string {
		return this.sparkles[Math.floor(Math.random() * 4)];
	},
};

export default emojis;
