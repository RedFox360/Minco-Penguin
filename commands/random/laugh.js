export var name = "laugh";
export var description = "Fun command: sends a random laugh";
export var aliases = ["haha", "hehe"];
export function execute() {
    var laughs = ["MWAHAHAHA!", "BHAHHAHAHAHHA", "tEEHee", "hehe", ":rofl:", "Hahahaha"];
    var random = Math.floor(Math.random() * laughs.length);
    return laughs[random];
}
