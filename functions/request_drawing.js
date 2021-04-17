"use strict";
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
exports.__esModule = true;
var Discord = require("discord.js");
exports["default"] = (function (message, args, client, profileData) { return __awaiter(void 0, void 0, void 0, function () {
    var claire, drawing, i, requestEmbed, returnEmbed, reactMsgCl, reactMsgAu, err_1, reacted, accepted, filter, collector, authorCollector;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.users.fetch("802668636795830292")];
            case 1:
                claire = _a.sent();
                drawing = "";
                for (i = 1; i < args.length; i++) {
                    drawing += args[i] + " ";
                }
                if (!args[1])
                    return [2 /*return*/, message.channel.send("Valid  export const usage =  !buy drawing <drawing>")];
                requestEmbed = new Discord.MessageEmbed()
                    .setColor("#70FFC2")
                    .setAuthor(message.author.username)
                    .setTitle("Drawing Request")
                    .setDescription(message.author.toString() + " from " + message.guild.name + " has requested a drawing:\n__" + drawing + "__");
                returnEmbed = new Discord.MessageEmbed()
                    .setColor("#54ACFE")
                    .setAuthor("Claire")
                    .setTitle("Drawing Request")
                    .setDescription("You have succesfully sent Claire a drawing request:\n__" + drawing + "__\n**Reactions**\n\uD83D\uDCDE: Send a message to Mason\n\u26D4\uFE0F: cancel your request");
                return [4 /*yield*/, claire.send(requestEmbed)];
            case 2:
                reactMsgCl = _a.sent();
                return [4 /*yield*/, message.author.send(returnEmbed)];
            case 3:
                reactMsgAu = _a.sent();
                message.channel.send("Request for drawing __" + drawing + "__ sent to Claire.");
                _a.label = 4;
            case 4:
                _a.trys.push([4, 11, , 12]);
                return [4 /*yield*/, reactMsgCl.react("✅")];
            case 5:
                _a.sent();
                return [4 /*yield*/, reactMsgCl.react("🚫")];
            case 6:
                _a.sent();
                return [4 /*yield*/, reactMsgCl.react("💵")];
            case 7:
                _a.sent();
                return [4 /*yield*/, reactMsgCl.react("📞")];
            case 8:
                _a.sent();
                return [4 /*yield*/, reactMsgAu.react("📞")];
            case 9:
                _a.sent();
                return [4 /*yield*/, reactMsgAu.react("⛔")];
            case 10:
                _a.sent();
                return [3 /*break*/, 12];
            case 11:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 12];
            case 12:
                reacted = false;
                accepted = false;
                filter = function (reaction, user) { return user.id !== "725917919292162051"; };
                collector = reactMsgCl.createReactionCollector(filter, {
                    time: ms("30m")
                });
                authorCollector = reactMsgAu.createReactionCollector(filter, {
                    time: ms("30m")
                });
                collector.on("collect", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
                    var botMsg, userMessage, price_1, confirmPriceMsg_1, filter2, confirmCollector_1, botMsg, userMessage, userReactions, _i, _a, reaction_1, error_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                reacted = true;
                                if (!(reaction.emoji.name == "🚫")) return [3 /*break*/, 1];
                                message.author.send("Claire has declined your request");
                                claire.send("You have declined the drawing request from " + message.author.toString() + ".");
                                collector.stop();
                                authorCollector.stop();
                                reactMsgCl["delete"]();
                                reactMsgAu["delete"]();
                                return [3 /*break*/, 13];
                            case 1:
                                if (!(reaction.emoji.name == "✅")) return [3 /*break*/, 2];
                                message.author.send("Claire has accepted your request");
                                accepted = true;
                                return [3 /*break*/, 13];
                            case 2:
                                if (!(reaction.emoji.name == "💵")) return [3 /*break*/, 9];
                                if (!!accepted) return [3 /*break*/, 3];
                                claire.send("Accept the request first before choosing a price.").then(function (msg) {
                                    setTimeout(function () {
                                        msg["delete"]();
                                    }, 5000);
                                });
                                return [3 /*break*/, 8];
                            case 3: return [4 /*yield*/, claire.send("Choose a price :dollar:: ")];
                            case 4:
                                botMsg = _b.sent();
                                return [4 /*yield*/, MessageCollector.asyncQuestion({
                                        botMessage: botMsg,
                                        user: "802668636795830292"
                                    })["catch"](console.error)];
                            case 5:
                                userMessage = _b.sent();
                                botMsg["delete"]();
                                price_1 = parseInt(userMessage);
                                if (!isNaN(price_1)) return [3 /*break*/, 6];
                                claire.send("Enter a valid number");
                                return [3 /*break*/, 8];
                            case 6:
                                if (price_1 > profileData.mincoDollars) {
                                    message.author.send("Claire has decided on a price of " + price_1 + " dollars. However, you don't have that much money. (you can send Claire a message by using the :telephone_receiver: button)");
                                    claire.send(message.author.toString() + " doesn't have that much money. You can decide on a different price or decline the drawing request.");
                                }
                                return [4 /*yield*/, message.author.send("Claire has decided on a price of " + price_1 + " Minco Dollars.\nReact below with a :white_check_mark: to agree and give " + price_1 + " Minco Dollars to claire.\nReact with a :no_entry_sign: if you disagree with the price.")];
                            case 7:
                                confirmPriceMsg_1 = _b.sent();
                                confirmPriceMsg_1
                                    .react("✅")
                                    .then(function () { return confirmPriceMsg_1.react("🚫"); })["catch"](console.error);
                                filter2 = function (reaction, user) { return user.id !== "725917919292162051"; };
                                confirmCollector_1 = confirmPriceMsg_1.createReactionCollector(filter2, { time: 10000 });
                                confirmCollector_1.on("collect", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                if (!(reaction.emoji.name == "✅")) return [3 /*break*/, 3];
                                                return [4 /*yield*/, profileModel.findOneAndUpdate({ userID: message.author.id }, {
                                                        $inc: {
                                                            mincoDollars: -price_1
                                                        }
                                                    })];
                                            case 1:
                                                _a.sent();
                                                return [4 /*yield*/, profileModel.findOneAndUpdate({ userID: "802668636795830292" }, {
                                                        $inc: {
                                                            mincoDollars: price_1
                                                        }
                                                    })];
                                            case 2:
                                                _a.sent();
                                                claire.send(message.author.toString() + " has confirmed the price. You have received " + price_1 + " Minco Dollars");
                                                message.author.send("You have accepted the price. " + price_1 + " Minco Dollars from your profile have been given to Claire.");
                                                return [3 /*break*/, 4];
                                            case 3:
                                                claire.send(message.author.toString() + " disagreed with the price. You can decline the request or choose a new price.");
                                                message.author.send("You have declined the price.");
                                                _a.label = 4;
                                            case 4:
                                                confirmPriceMsg_1["delete"]();
                                                confirmCollector_1.stop();
                                                return [2 /*return*/];
                                        }
                                    });
                                }); });
                                claire.send("Price set to " + price_1 + " Minco Dollars").then(function (msg) {
                                    setTimeout(function () {
                                        msg["delete"]();
                                    }, 10000);
                                });
                                _b.label = 8;
                            case 8: return [3 /*break*/, 13];
                            case 9:
                                if (!(reaction.emoji.name == "📞")) return [3 /*break*/, 13];
                                return [4 /*yield*/, claire.send("Send a message to " + message.author.toString() + "...")];
                            case 10:
                                botMsg = _b.sent();
                                return [4 /*yield*/, MessageCollector.asyncQuestion({
                                        botMessage: botMsg,
                                        user: "802668636795830292"
                                    })["catch"](console.error)];
                            case 11:
                                userMessage = _b.sent();
                                return [4 /*yield*/, message.author.send("Message from <@" + userMessage.author.id + ">: " + userMessage.content)];
                            case 12:
                                _b.sent();
                                botMsg["delete"]();
                                claire.send("Message sent").then(function (msg) {
                                    setTimeout(function () {
                                        msg["delete"]();
                                    }, 2000);
                                });
                                _b.label = 13;
                            case 13:
                                userReactions = reactMsgCl.reactions.cache.filter(function (react) { return react.users.cache.has("802668636795830292"); });
                                _b.label = 14;
                            case 14:
                                _b.trys.push([14, 19, , 20]);
                                _i = 0, _a = userReactions.values();
                                _b.label = 15;
                            case 15:
                                if (!(_i < _a.length)) return [3 /*break*/, 18];
                                reaction_1 = _a[_i];
                                return [4 /*yield*/, reaction_1.users.remove("802668636795830292")];
                            case 16:
                                _b.sent();
                                _b.label = 17;
                            case 17:
                                _i++;
                                return [3 /*break*/, 15];
                            case 18: return [3 /*break*/, 20];
                            case 19:
                                error_1 = _b.sent();
                                console.error("Failed to remove reactions.");
                                return [3 /*break*/, 20];
                            case 20: return [2 /*return*/];
                        }
                    });
                }); });
                collector.on("end", function (collected) {
                    if (!reacted) {
                        claire.send("Reactions timed out");
                    }
                });
                authorCollector.on("collect", function (reaction, user) { return __awaiter(void 0, void 0, void 0, function () {
                    var botMsg, userMessage, userReactions, _i, _a, reaction_2, error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(reaction.emoji.name == "📞")) return [3 /*break*/, 4];
                                return [4 /*yield*/, message.author.send("Send a message to Claire...")];
                            case 1:
                                botMsg = _b.sent();
                                return [4 /*yield*/, MessageCollector.asyncQuestion({
                                        botMessage: botMsg,
                                        user: message.author.id
                                    })];
                            case 2:
                                userMessage = _b.sent();
                                return [4 /*yield*/, claire.send("Message from " + message.author.toString() + ": " + userMessage.content)];
                            case 3:
                                _b.sent();
                                botMsg["delete"]();
                                message.author.send("Message Sent").then(function (msg) {
                                    setTimeout(function () {
                                        msg["delete"]();
                                    }, 2000);
                                });
                                return [3 /*break*/, 5];
                            case 4:
                                if (reaction.emoji.name == "⛔") {
                                    claire.send(message.author.toString() + " has canceled the request.");
                                    message.author.send("You have canceled the request");
                                    collector.stop();
                                    authorCollector.stop();
                                    reactMsgAu["delete"]();
                                    reactMsgCl["delete"]();
                                }
                                _b.label = 5;
                            case 5:
                                userReactions = reactMsgAu.reactions.cache.filter(function (react) { return react.users.cache.has(message.author.id); });
                                _b.label = 6;
                            case 6:
                                _b.trys.push([6, 11, , 12]);
                                _i = 0, _a = userReactions.values();
                                _b.label = 7;
                            case 7:
                                if (!(_i < _a.length)) return [3 /*break*/, 10];
                                reaction_2 = _a[_i];
                                return [4 /*yield*/, reaction_2.users.remove(message.author.id)];
                            case 8:
                                _b.sent();
                                _b.label = 9;
                            case 9:
                                _i++;
                                return [3 /*break*/, 7];
                            case 10: return [3 /*break*/, 12];
                            case 11:
                                error_2 = _b.sent();
                                console.error("Failed to remove reactions.");
                                return [3 /*break*/, 12];
                            case 12: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); });
