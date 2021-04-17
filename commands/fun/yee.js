export var name = "yee";
export var description = "Sends a random yee gif";
export var cooldown = 1;
export var aliases = ["yeee", "yeeeee", "yeeeeee", "yeeeeeee", "yeeeeeeee", "yeeeeeeeee", "yeeeeeeeeee", "eeeeeeeeeee"];
export function execute(message, args) {
    var yees = [
        "https://tenor.com/view/yee-yeedinasour-dinasour-gif-4930781",
        "https://tenor.com/view/yee-dinosaur-meme-smile-gif-15696659",
        "https://tenor.com/view/yeet-yee-yeee-meme-gif-13537661",
    ];
    if (args[0] == "all") {
        yees.forEach(function (yee) { return message.channel.send(yee); });
    }
    else {
        var random = Math.floor(Math.random() * yees.length);
        message.channel.send(yees[random]);
    }
}
