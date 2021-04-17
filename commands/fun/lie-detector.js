import { MessageEmbed } from "discord.js";
export var name = "lie-detector";
export var aliases = ["lied", "ld"];
export var description = "Credit to Aiden for the idea : sends a is lying/not lying message";
export var usage = "!ld <Question>";
/** @param {Message} message */
export function execute(message, args) {
    var randomL = [
        message.author.toString() + " is lying!",
        message.author.toString() + " is telling the truth!",
        "hmmmm... I need more info!",
        "I think " + message.author.toString() + " is telling the truth",
        message.author.toString() + " is DEFINITELY lying.",
    ];
    var randomInt = Math.floor(Math.random() * randomL.length);
    var color = randomL[randomInt].includes("lying") ? "F75853" : "58D68D";
    if (randomL[randomInt].includes("info"))
        color = "F9E79F";
    var name = message.member.displayName || message.author.username;
    message.channel.send(new MessageEmbed()
        .setTitle("Lie Detector")
        .setDescription(randomL[randomInt])
        .setColor(color)
        .setFooter(args.join(" ") + " | " + name));
}
