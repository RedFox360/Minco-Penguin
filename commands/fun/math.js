import { Message } from 'discord.js';
const profileModel = require('../../models/profileSchema')

const { MessageCollector } = require('discord.js-collector');
module.exports = {
    name: 'math',
    description: "Sends a math question for you to solve",
    usage: '!math <easy/medium/hard> <operation>',
    cooldown: 30,
    /** @param {Message} message */
    async execute(message, args) {
        var num1, num2, result, timeLimit;
        if (!args.length) return message.channel.send("Invalid usage. Correct usage: !math <easy/medium/hard> <operation>\n(Divions is not a permitted operation)")
        var oper;
        if (args[1] == 'add' || args[1] == 'addition' || args[1] == '+') oper = '+'
        else if (args[1] == 'subtract' || args[1] == 'minus' || args[1] == '-') oper = '-'
        else if (args[1] == 'multiply' || args[1] == 'mult' || args[1] == 'x' || args[1] == '*') oper = '*'
        else return message.channel.send("Invalid usage: Correct usage: !math <easy/medium/hard> <operation>\n(Division is not a permitted operation)")
        if (args[0] == 'easy') {
            timeLimit = 7;
            if (oper == '*') {
                num1 = random(1, 10)
                num2 = random(1, 10)
            } else {
                num1 = random(10, 100)
                num2 = random(10, 100)
            }
        } else if (args[0] == 'medium') {
            timeLimit = 15
            if (oper == '*') {
                num1 = random(4, 16)
                num2 = random(4, 16)
            } else {
                num1 = random(100, 250)
                num2 = random(75, 300)
            }
        } else {
            timeLimit = 25
            if (oper == '*') {
                num1 = random(10, 30)
                num2 = random(10, 30)
            } else {
                num1 = random(200, 500)
                num2 = random(200, 500)
            }
        }
        if (oper == '+') result = `${num1 + num2}`;
        else if (oper == '-') result = `${num1 - num2}`
        else if (oper == '*') result = `${num1 * num2}`
        let botMsg = await message.channel.send(`What is ${num1} ${oper} ${num2}?`)
        let userMessage = await MessageCollector.asyncQuestion({
            botMessage: botMsg,
            user: message.author.id
        }).catch(console.error);

        let guess = userMessage.content;
        if (guess == result) {
            message.channel.send("Correct!")
            var amount;
            if (args[0] == 'easy') {
                amount = 10;
                message.channel.send("You won 10 coins!");
            } else if (args[0] == 'medium') {
                amount = 25;
                message.channel.send("You won 25 coins!");
            } else {
                amount = 50;
                message.channel.send("You won 50 coins!");
            }
            await profileModel.findOneAndUpdate({ userID: message.author.id }, {
                $inc: {
                    mincoDollars: amount
                }
            });
        }
        else return `Incorrect! The correct answer is ${result}`;
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
