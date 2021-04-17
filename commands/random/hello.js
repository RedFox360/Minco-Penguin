export var name = "hello";
export var description = "Returns a random hello message.";
export var cooldown = 1;
export var aliases = ["howdy", "hi"];
export function execute(message) {
    var hellos = [
        "Hi :)",
        "Hai!",
        "Hello! :)",
        "Salutations, " + message.author.toString(),
        "Bonjour!",
        "Greetings, " + message.author.toString(),
        "Howdy! :cowboy:",
    ];
    var random = Math.floor(Math.random() * hellos.length);
    return hellos[random];
}
