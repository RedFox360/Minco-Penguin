export var name = "bye";
export var description = "Sends a random goodbye message";
export function execute() {
    var byes = ["Goodbye", "Adios!", "Cheerio!", "Later!", "I'm out."];
    var random = Math.floor(Math.random() * byes.length);
    return byes[random];
}
