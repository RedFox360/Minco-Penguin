export var name = "random";
export var description = "Returns a random number between 2 numbers";
export var aliases = ["rand"];
export var usage = "!random <min number> <max number>";
export function execute(_, args) {
    var min = parseInt(args[0]);
    var max = parseInt(args[1]);
    if (isNaN(min) || isNaN(max))
        return "Enter valid numbers";
    if (max < min)
        return "Your second number must be greater than your first number";
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    return random.toLocaleString();
}
