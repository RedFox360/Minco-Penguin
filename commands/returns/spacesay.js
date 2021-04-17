export var name = "spacesay";
export var description = "puts spaces between characters in the say command";
export var cooldown = 3;
export var usage = "!spacesay <words>";
export function execute(message, args, cmd, client, profileData) {
    var msgSplit = args.join(" ").split("");
    for (var i = 0; i < msgSplit.length; i++) {
        if (msgSplit[i] != "_" && msgSplit[i] != "*" && msgSplit[i] != "~") {
            if (msgSplit[i + 1] != "*" && msgSplit[i + 1] != "_" && msgSplit[i + 1] != "~")
                msgSplit[i] += " ";
        }
    }
    var msg = msgSplit.join("");
    message.channel.send(msg);
}
