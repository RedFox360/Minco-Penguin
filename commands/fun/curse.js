export var name = "curse";
export var description = "Curses someone with a Harry Potter curse";
export var usage = "!curse <person> <Harry Potter curse>";
/** @param {Message} message */
export function execute(message, args) {
    if (!args[1])
        return "Valid  export const usage =  !curse <person> <Harry Potter curse>";
    var person = args[0];
    var curse = "";
    for (var i = 1; i < args.length; i++) {
        curse += args[i] + " ";
    }
    var checkCurse = curse.toLowerCase();
    if (checkCurse.includes("avada kedavra") ||
        checkCurse.includes("crucio") ||
        checkCurse.includes("imperio") ||
        checkCurse.includes("imperius") ||
        checkCurse.includes("cruciatus") ||
        checkCurse.includes("sectumsempra"))
        return "HEY! No dark magic here.";
    return person + " was cursed by " + message.author.toString() + " using the" + curse + " curse";
}
