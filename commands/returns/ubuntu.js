module.exports = {
	description: "Get the ubuntu name of someone",
	usage: "!ubuntu name <person>",
	servers: ["827635704145772574"],
	run(_, args) {
		switch (args[1].toLowerCase()) {
			case "sammy":
				return "Kirabo the Wizard";
			case "shriya":
				return "Queen Adelaide";
			case "ishan":
				return "King Asgard";
			case "neil":
				return "Mokuku (also Ishan)";
			case "annie":
				return "General Jamilla";
		}
	},
};
