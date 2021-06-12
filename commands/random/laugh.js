module.exports = {
	description: "Fun command: sends a random laugh",
	aliases: ["haha", "hehe"],
	execute: () => ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"].rand(),
};
