var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import profileModel from "../../models/profileSchema";
import * as ms from "ms";
export var name = "math";
export var description = "Sends a math question for you to solve";
export var usage = "!math <easy/medium/hard> <operation>";
export var cooldown = ms("5m") / 1000;
/** @param {Message} message */
export function execute(message, args) {
    return __awaiter(this, void 0, void 0, function () {
        var num1, num2, result, timeLimit, oper, time, filter, collector, sendTimeOut;
        var _this = this;
        return __generator(this, function (_a) {
            if (!args.length)
                return [2 /*return*/, "Invalid usage. Correct  export const usage =  !math <easy/medium/hard> <operation>\n(Divions is not a permitted operation)"];
            if (args[1] == "add" || args[1] == "addition" || args[1] == "+")
                oper = "+";
            else if (args[1] == "subtract" || args[1] == "minus" || args[1] == "-")
                oper = "-";
            else if (args[1] == "multiply" || args[1] == "mult" || args[1] == "x" || args[1] == "*")
                oper = "*";
            else
                return [2 /*return*/, "Invalid  export const usage =  Correct  export const usage =  !math <easy/medium/hard> <operation>\n(Division is not a permitted operation)"];
            if (args[0] == "easy") {
                timeLimit = 7;
                if (oper == "*") {
                    num1 = random(5, 12);
                    num2 = random(5, 12);
                }
                else {
                    num1 = random(50, 250);
                    num2 = random(100, 300);
                }
            }
            else if (args[0] == "medium") {
                timeLimit = 15;
                if (oper == "*") {
                    num1 = random(12, 20);
                    num2 = random(12, 20);
                }
                else {
                    num1 = random(400, 800);
                    num2 = random(400, 800);
                }
            }
            else {
                timeLimit = 25;
                if (oper == "*") {
                    num1 = random(40, 60);
                    num2 = random(30, 50);
                }
                else {
                    num1 = random(600, 1200);
                    num2 = random(600, 1200);
                }
            }
            if (oper == "+")
                result = "" + (num1 + num2);
            else if (oper == "-")
                result = "" + (num1 - num2);
            else if (oper == "*")
                result = "" + num1 * num2;
            message.channel.send("What is " + num1 + " " + oper + " " + num2 + "?");
            time = 15;
            if (args[0] == "easy")
                time = 7;
            else if (args[0] == "medium")
                time = 12;
            filter = function (m) { return m.author.id == message.author.id; };
            time *= 1000;
            collector = message.channel.createMessageCollector(filter, { time: time });
            sendTimeOut = true;
            collector.on("collect", function (m) { return __awaiter(_this, void 0, void 0, function () {
                var guess, amount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sendTimeOut = false;
                            guess = m.content;
                            if (!(guess == result)) return [3 /*break*/, 2];
                            message.channel.send("Correct!");
                            if (args[0] == "easy")
                                amount = 10;
                            else if (args[0] == "medium")
                                amount = 20;
                            else
                                amount = 40;
                            message.channel.send("You won " + amount + " Minco Dollars!");
                            return [4 /*yield*/, profileModel.findOneAndUpdate({ userID: message.author.id }, {
                                    $inc: {
                                        mincoDollars: amount
                                    }
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                        case 2:
                            message.channel.send("Incorrect!");
                            _a.label = 3;
                        case 3:
                            collector.stop();
                            return [2 /*return*/];
                    }
                });
            }); });
            collector.on("end", function (collected) {
                if (sendTimeOut)
                    return message.reply("Timed out!");
            });
            return [2 /*return*/];
        });
    });
}
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
