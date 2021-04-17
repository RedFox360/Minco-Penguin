export var name = "army";
export var description = "This is a test command for Minco Penguin";
export function execute(message, args) {
    if (args[0] != null && args[0].toLowerCase().startsWith("carl"))
        return "Turtles🐢, Dolphins🐬, Lizards🦎, Monkeys🐵🐒, Birds🦜";
    else
        return "Penguins🐧, Candy bears🍬🐻, Blobfish, Doges, Vibing Cats, Jellyfish";
}
