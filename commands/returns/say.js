"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.cooldown = exports.description = exports.name = void 0;
exports.name = "say";
exports.description = "This is a say command for Minco Penguin";
exports.cooldown = 3;
exports.usage = "!say <words>";
function execute(message, args, _, client) {
    if (!args.length)
        return "You didn't provide any arguments.";
    if (args[0].startsWith("<#")) {
        var channel = args[0];
        channel = channel.replace("<", "").replace(">", "").replace("#", "");
        var msg = "";
        for (var i = 1; i < args.length; i++) {
            msg += args[i] + " ";
        }
        var chnl = client.channels.cache.get(channel);
        chnl.send(msg);
        message.react("✅");
    }
    else {
        message.channel.send(args.join(" "));
    }
}
exports.execute = execute;
