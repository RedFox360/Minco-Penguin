module.exports = {
    description: "Adds a clap emoji between the words in your message",
    usage: "!clap <message>",

    execute(_, args) {
        if (!args.length) return "Enter a valid message";
        return args.join(" :clap: ");
    }
}