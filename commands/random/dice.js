export var name = "dice";
export var aliases = ["roll", "diceroll", "die"];
export var description = "Roll a die (returns a random number between 1 and 6, inclusive)";
export function execute() {
    var random = Math.floor(Math.random() * 6) + 1;
    return random.toString();
}
