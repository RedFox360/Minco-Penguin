import { MessageEmbed } from "discord.js";
export var name = "magic8ball";
export var description = "A magic 8 ball in Discord";
export var cooldown = 4;
export var usage = "!magic8ball <Question>";
export var aliases = ["8b", "magic8b", "8ball"];
export function execute(message, args) {
    if (args.join(" ").replace(" ", "").toLowerCase().includes("crush"))
        return message.channel.send("Stop asking questions about crushes!");
    var answers = [
        "Yes",
        "No",
        "I am not completely sure",
        "It is decidedly so",
        "OBVIOUSLY",
        "OBVIOUSLY No",
        "Doubtful",
        "Undoubtedly",
        "SERIOUSLY? NO",
        "Ya think so?",
        "Ofc",
        "Why did you even ask that?",
        "Nah",
        "Meh",
        "No question!",
        "Sorry, I was confunded. Try again.",
        "Probably not.",
        "eh",
        "Of course!!!!",
        "Are you kidding me? Definitely not.",
        "Really?",
        "Ya think so?",
        "Totally!",
        "YES",
        "YESSSS",
        "Yea",
        "Seriously? YES",
        "Yes, DUH",
    ];
    var random = Math.floor(Math.random() * answers.length);
    var noPhrases = ["no", "doubtful", "nah"];
    var yesPhrases = ["no question"];
    var color = "32E6C5";
    for (var _i = 0, noPhrases_1 = noPhrases; _i < noPhrases_1.length; _i++) {
        var phrase = noPhrases_1[_i];
        if (answers[random].toLowerCase().includes(phrase))
            color = "F75853";
    }
    for (var _a = 0, yesPhrases_1 = yesPhrases; _a < yesPhrases_1.length; _a++) {
        var phrase = yesPhrases_1[_a];
        if (answers[random].toLowerCase().includes(phrase))
            color = "32E6C5";
    }
    var name = message.member.displayName || message.author.username;
    message.channel.send(new MessageEmbed()
        .setTitle("Magic 8 Ball")
        .setDescription(answers[random])
        .setColor(color)
        .setFooter(args.join(" ") + " | " + name));
}
