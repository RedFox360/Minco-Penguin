const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "dog",
	description:
		"Sends a random dog picture (oreo, archie, or rocco) or a nice looking embed",
	usage: "!dog (info) oreo/archie/rocco",
	execute(message, args) {
		var pics;
		var oreoPics = [
			"https://cdn.discordapp.com/attachments/808089047318134794/826527871542493184/63669166328__718717DF-7C6F-4F66-872E-A54799AC53D3.jpg",
			"https://cdn.discordapp.com/attachments/808089047318134794/826527963125514290/IMG_0828.jpg",
			"https://cdn.discordapp.com/attachments/808089047318134794/826528009808248912/IMG_0402.jpg",
			"https://cdn.discordapp.com/attachments/808089047318134794/826528062883495956/IMG_0133.jpg",
			"https://cdn.discordapp.com/attachments/808089047318134794/826528464105898024/IMG_2558.JPG",
			"https://cdn.discordapp.com/attachments/808089047318134794/826529101879574558/IMG_1977.JPG",
			"https://cdn.discordapp.com/attachments/808089047318134794/826529242711851059/IMG_0231.jpg",
			"https://cdn.discordapp.com/attachments/808089047318134794/826529313272758322/IMG_2389.JPG",
			"https://cdn.discordapp.com/attachments/808089047318134794/826529408881655829/IMG_0615.JPG",
			"https://cdn.discordapp.com/attachments/808089047318134794/826529520945201182/IMG_0716.JPG",
		];
		var archiePics = [
			"https://cdn.discordapp.com/attachments/786296784136699915/826530278095847514/Screen_Shot_2021-03-10_at_7.20.01_AM.png",
			"https://cdn.discordapp.com/attachments/786296784136699915/826530295133503508/Screen_Shot_2021-03-10_at_8.57.03_AM.png",
			"https://cdn.discordapp.com/attachments/786296784136699915/826530393901629470/Screen_Shot_2021-03-10_at_8.58.27_AM.png",
			"https://cdn.discordapp.com/attachments/786296784136699915/826530415102787714/Screen_Shot_2021-03-13_at_10.34.25_AM.png",
			"https://cdn.discordapp.com/attachments/786296784136699915/826530440814919720/Screen_Shot_2021-02-18_at_10.39.46_AM.png",
		];
		var roccoPics = [
			"https://cdn.discordapp.com/attachments/774431427222569031/826542646406283356/IMG_1768.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542695132037140/20201221_113344.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542708683571260/20200823_152604_2.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542728833663048/20201225_073404.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/0826542744063180800/20201221_113344.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542751755272233/20200823_152604_2.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542782977540146/20201221_112140.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542789331386438/20200813_134212.jpg",
			"https://cdn.discordapp.com/attachments/774431427222569031/826542790237880330/20201221_113400.jpg",
		];
		if (args[0] == "info") {
			let embed = new MessageEmbed().setTitle("Dog Info");
			if (args[1] == "oreo" || args[1] == "Oreo") {
				embed
					.setDescription(
						"Oreo is a black and white Shih Tzu who lives with Emma. He loves to go on walks and play. He loves everyone that he meets and knows lots of tricks such as, sit, stay, shake, high five, dance, and lie down. :heart:"
					)
					.addFields(
						{
							name: "Age",
							value: "2",
							inline: true,
						},
						{
							name: "Birthday",
							value: "May 18",
							inline: true,
						},
						{
							name: "Breed",
							value: "Pure Shih Tzu",
							inline: true,
						}
					)
					.setColor("FF8B8B")
					.setThumbnail(oreoPics[Math.floor(Math.random() * oreoPics.length)]);
			} else if (args[1] == "archie" || args[1] == "Archie") {
				embed
					.setDescription(
						"Archie is a rescue. He was adopted from Maltese and More in La Jolla and now lives with Meera's family. Archie likes going on car rides and hiking. He only likes to be with his family. Archie is grey with silverish legs and a bit of goldish brown on his mustache. He likes playing Tug of War and Hide and Seek. Archie is a picky eater, but he likes to eat human food like chicken and turkey. The tricks he knows are sit, shake paw, down, roll, stay, under, over, and jump."
					)
					.addFields(
						{
							name: "Age",
							value: "4",
							inline: true,
						},
						{
							name: "Birthday",
							value: "March 18",
							inline: true,
						},
						{
							name: "Breed",
							value: "Unknown (probably poodle mix)",
						}
					)
					.setColor("3498DB") // blue
					.setThumbnail(
						archiePics[Math.floor(Math.random() * archiePics.length)]
					);
			} else if (args[1] == "rocco" || args[1] == "Rocco") {
				embed
					.setDescription(
						"Rocco is a red/brown toy poodle that was born in Texas and lives with Mason L. We got Rocco when he was 4 months old and in November. He loves to play with Mason L and his mom."
					)
					.addFields(
						{
							name: "Age",
							value: "4 1/2",
							inline: true,
						},
						{
							name: "Birthday",
							value: "July 26",
							inline: true,
						},
						{
							name: "Breed",
							value: "Red/Brown Toy Poodle",
							inline: true,
						}
					)
					.setColor("F7DC6F")
					.setThumbnail(
						roccoPics[Math.floor(Math.random() * roccoPics.length)]
					);
			} else {
				message.channel.send("Enter a valid dog name (oreo, archie, or rocco)");
				return;
			}
			message.channel.send(embed);
			return;
		}
		if (args[0] == "oreo") {
			pics = oreoPics;
		} else if (args[0] == "archie") {
			pics = archiePics;
		} else if (args[0] == "rocco") {
			pics = roccoPics;
		} else {
			return message.channel.send("Enter a valid dog (oreo/archie/rocco)");
		}

		let random = Math.floor(Math.random() * pics.length);
		if (args[1] == "all") {
			pics.forEach((pic) => message.channel.send(pic));
		} else {
			message.channel.send(pics[random]);
		}
	},
};
