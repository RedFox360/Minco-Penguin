export var name = "coinflip";
export var aliases = ["flip"];
export var description = 'Returns "heads" or "tails" based on a random outcome.';
export function execute(_, args) {
    var random = Math.floor(Math.random() * 2);
    var options = [];
    if (args[0] == "yn")
        options = [":thumbsup: Yes", ":thumbsdown: No"];
    else
        options = [":coin: Heads", ":coin: Tails"];
    return options[random];
}
