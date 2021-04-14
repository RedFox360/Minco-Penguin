const { simplify } = require("mathjs");
module.exports = {
    name: 'solve',
    description: 'Solve a math problem\nOperations: +, -, *, /, ^, sqrt, cbrt',
    aliases: ['s'],
    usage: '!solve <Math Equation>',
    execute(message, args, cmd, client, profileData) {
        if (!args.length) return message.channel.send("Enter valid arguments\nValid usage: !s 2 + 2 * 3 (spaces between numbers and operations required)\nOperations: +: add, - (subtract), *: multiply, /: divide, ^: exponents, sqrt(number): Square Root, cbrt(number): Cube Root")
        const equation = simplify(args.join(' ')).toString().split(' ');
        const result = calculate(equation[0], equation[2], equation[1]);
        if (result == '∞') result = 'undefined';
        message.channel.send(`${args.join(' ')} = __${result.toLocaleString()}__`);
    }
}

function calculate(num1_s, num2_s, oper) {
    const num1 = parseFloat(num1_s);
    const num2 = parseFloat(num2_s);
    if (!num2) return num1
    else return parseInt(simplify(`${num1} ${oper} ${num2}`).toString());
}