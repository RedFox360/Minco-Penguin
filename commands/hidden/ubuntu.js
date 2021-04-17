export var name = "ubuntu";
export var description = "Get the ubuntu name of someone";
export function execute(_, args) {
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
}
