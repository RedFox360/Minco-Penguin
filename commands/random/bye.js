module.exports = {
	name: "bye",
	description: "Sends a random goodbye message",
	execute() {
		let byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
		let random = Math.floor(Math.random() * byes.length);
		return byes[random];
	},
};
