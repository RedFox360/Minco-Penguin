import { Message } from 'discord.js';
module.exports = {
    name: 'curse',
    description: 'Curses someone with a Harry Potter curse',
    usage: '!curse <person> <Harry Potter curse>',
    /** @param {Message} message */
    execute(message, args) {
        if (!args[1]) return 'Valid usage: !curse <person> <Harry Potter curse>';
        var person = args[0];
        var curse = "";
        for (let i = 1; i < args.length; i++) {
            curse += args[i] + " ";
        }
        let checkCurse = curse.toLowerCase();
        if (checkCurse.includes('avada kedavra') || checkCurse.includes('crucio') || checkCurse.includes('imperio') || checkCurse.includes('imperius') || checkCurse.includes('cruciatus') || checkCurse.includes('sectumsempra')) return "HEY! No dark magic here.";
        return `${person} was cursed by ${message.author.toString()} using the${curse} curse`;
    }
}