export default {
	rod: '<:fishing_rod:918671810395000862>',
	axolotlEmojis: [
		'<:blue_axolotl:918657282781376532>',
		'<:brown_axolotl:918657282848464926>',
		'<:cyan_axolotl:918657282781368330>',
		'<:gold_axolotl:918657282831704144>',
		'<:pink_axolotl:918657282844266517>'
	],
	sparkles: [
		'<:blue_sparkle:917911870420160534>',
		'<:light_blue_sparkle:917911870575378433>',
		'<:pink_sparkle:917911870629900368>',
		'<:yellow_sparkle:917911870722170900>'
	],
	cods: '<:cod:918657282642948126>',
	salmons: '<:salmon:918657282668113950>',
	pufferfish: '<:pufferfish:918657282710069319>',
	clownfish: '<:clownfish:918657282001235979>',
	cookedCod: '<:cooked_cod:919306796156473426>',
	cookedSalmon: '<:cooked_salmon:919306796374585414>',
	lionfish: '<:lionfish:965039900833505380>',
	starfish: '<:starfish:965040156405039165>',
	sharks: '๐ฆ',
	tuna: '๐',
	turtles: '๐ข',
	crabs: '๐ฆ',
	shrimp: '๐ฆ',
	clams: '<:clam:965041061007356104>',
	coral: '<:coral:967518451335848026>',
	crayfish: '๐ฆ',
	eels: '<:eel:965042271844171796>',
	frogs: '๐ธ',
	lobsters: '๐ฆ',
	mussels: '๐ฆช',
	octopi: '๐',
	oysters: '๐ฆช',
	snails: '๐',
	squid: '๐ฆ',
	tadpoles: '๐ธ',
	trout: '๐',
	urchins: '<:urchin:965042881394016256>',
	cavefish: '๐',
	groupers: '๐',
	anglerfish: '๐ฎ',
	seasnakes: '๐',
	seaweed: '๐ฟ',
	plasticBag: '๐',
	boot: '๐ฅพ',
	bottle: '๐งด',
	can: '๐ฅค',
	cardboardBox: '๐ฆ',
	tire: '๐',
	get axolotls(): string {
		return this.axolotlEmojis[Math.floor(Math.random() * 5)];
	},
	get sparkle(): string {
		return this.sparkles[Math.floor(Math.random() * 4)];
	}
};
