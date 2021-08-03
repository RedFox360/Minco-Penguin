module.exports = {
	description: "Fun command: sends a random laugh",
	aliases: ["haha", "hehe"],
	run: () => ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"].rand(),
};
