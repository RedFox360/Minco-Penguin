"use strict";
exports.__esModule = true;
exports.execute = exports.usage = exports.aliases = exports.description = exports.name = void 0;
var mathjs_1 = require("mathjs");
exports.name = "solve";
exports.description = "Solve a math problem\nOperations: +, -, *, /, ^, sqrt, cbrt";
exports.aliases = ["s"];
exports.usage = "!solve <Math Equation>";
function execute(message, args, cmd, client, profileData) {
    if (!args.length)
        return message.channel.send("Enter valid arguments\nValid  export const usage =  !s 2 + 2 * 3 (spaces between numbers and operations required)\nOperations: +: add, - (subtract), *: multiply, /: divide, ^: exponents, sqrt(number): Square Root, cbrt(number): Cube Root");
    var equation = mathjs_1.simplify(args.join(" ")).toString().split(" ");
    var result = calculate(equation[0], equation[2], equation[1]);
    message.channel.send(args.join(" ") + " = __" + result.toLocaleString() + "__");
}
exports.execute = execute;
function calculate(num1_s, num2_s, oper) {
    var num1 = parseFloat(num1_s);
    var num2 = parseFloat(num2_s);
    if (!num2)
        return num1;
    else
        return parseInt(mathjs_1.simplify(num1 + " " + oper + " " + num2).toString());
}
