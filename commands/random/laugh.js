module.exports = {
	name: "laugh",
	description: "Fun command: sends a random laugh",
	aliases: ["haha", "hehe"],
	execute() {
		let laughs = ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"];
		let random = Math.floor(Math.random() * laughs.length);
		return laughs[random];
	},
};
