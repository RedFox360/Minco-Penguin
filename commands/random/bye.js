module.exports = {
	description: "Sends a random goodbye message",
	execute: () => ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."].rand(),
};
