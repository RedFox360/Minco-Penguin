import { MessageEmbed } from "discord.js";
export var name = "embed";
export var description = "Sends an embed to a channel";
export var usage = "!embed <Title> <Description>";
export function execute(message, args) {
    var td = args.join(" ").split("|");
    var embed = new MessageEmbed().setTitle(td[0]).setDescription(td[1]);
    message.channel.send(embed);
}
