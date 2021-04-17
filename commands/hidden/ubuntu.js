"use strict";
exports.__esModule = true;
exports.execute = exports.description = exports.name = void 0;
exports.name = "ubuntu";
exports.description = "Get the ubuntu name of someone";
function execute(_, args) {
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
exports.execute = execute;
