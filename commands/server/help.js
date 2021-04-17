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
import * as Discord from "discord.js";
import { commands } from "../../main";
import * as fs from "fs";
export var name = "help";
export var description = "Help for all Minco Penguin commands!";
export var aliases = ["c"];
/**
 * @param {Discord.Message} message
 * @param {Discord.Client} client
 */
export function execute(message, args, _, client) {
    return __awaiter(this, void 0, void 0, function () {
        var color, command, commandEmbed, description, titles, currentPage, helpEmbed, helpMsg, fields, categories, _i, categories_1, category, commandFiles, _a, commandFiles_1, file, command, pos, err_1, filter, collector;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    color = "C782FE";
                    if (args.length) {
                        command = commands.get(args[0]) || client.commands.find(function (a) { return a.aliases && a.aliases.includes(args[0]); });
                        if (!command)
                            return [2 /*return*/, message.channel.send("Enter a valid command name")];
                        commandEmbed = new Discord.MessageEmbed()
                            .setTitle(command.usage || "!" + command.name)
                            .setDescription(command.description)
                            .setColor(color);
                        return [2 /*return*/, message.channel.send(commandEmbed)];
                    }
                    description = "Use the :rewind: and :fast_forward: reactions to switch between pages.\nDon't put **< >** in the actual commands.\n**( )** show optional arguments\n\n**Categories**:\n`INFO/USEFUL commands`\n`FUN Commands`\n`SERVER Commands`\n`RANDOM RETURN Commands`\n`ECONOMY Commands`";
                    titles = [
                        "Minco Penguin Commands",
                        "INFO/USEFUL Commands",
                        "FUN Commands",
                        "SERVER Commands",
                        "RANDOM RETURN Commands",
                        "ECONOMY Commands",
                    ];
                    currentPage = 0;
                    helpEmbed = new Discord.MessageEmbed()
                        .setTitle(titles[currentPage])
                        .setDescription(description)
                        .setColor(color)
                        .setFooter(message.guild.name);
                    return [4 /*yield*/, message.channel.send(helpEmbed)];
                case 1:
                    helpMsg = _b.sent();
                    fields = [[], [], [], [], [], []];
                    categories = fs.readdirSync("./commands/").filter(function (file) { return !file.endsWith(".DS_Store"); });
                    for (_i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
                        category = categories_1[_i];
                        if (category != "hidden") {
                            commandFiles = fs.readdirSync("./commands/" + category).filter(function (File) { return File.endsWith(".js"); });
                            for (_a = 0, commandFiles_1 = commandFiles; _a < commandFiles_1.length; _a++) {
                                file = commandFiles_1[_a];
                                command = require("../../commands/" + category + "/" + file);
                                pos = 0;
                                if (category == "returns")
                                    pos = 1;
                                else if (category == "fun")
                                    pos = 2;
                                else if (category == "server")
                                    pos = 3;
                                else if (category == "random")
                                    pos = 4;
                                else if (category == "economy")
                                    pos = 5;
                                if (command.usage)
                                    fields[pos].push([command.usage, command.description]);
                                else
                                    fields[pos].push(["!" + command.name, command.description]);
                            }
                        }
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, helpMsg.react("⏪")];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, helpMsg.react("⏩")];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _b.sent();
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 6:
                    filter = function (reaction, user) { return user.id === message.author.id; };
                    collector = helpMsg.createReactionCollector(filter, { time: 300000 });
                    return [4 /*yield*/, collector.on("collect", function (reaction, user) { return __awaiter(_this, void 0, void 0, function () {
                            var userReactions, _i, _a, reaction_1, error_1;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (reaction.emoji.name == "⏪") {
                                            if (currentPage != 0)
                                                currentPage--;
                                            if (currentPage == 0) {
                                                helpEmbed = new Discord.MessageEmbed()
                                                    .setTitle(titles[0])
                                                    .setDescription(description)
                                                    .setColor(color)
                                                    .setFooter(message.guild.name);
                                                helpMsg.edit(helpEmbed);
                                            }
                                            else {
                                                helpEmbed = new Discord.MessageEmbed().setTitle(titles[currentPage]).setColor(color).setFooter(message.guild.name);
                                                fields[currentPage].forEach(function (field) {
                                                    helpEmbed.addField(field[0], field[1]);
                                                });
                                                helpMsg.edit(helpEmbed);
                                            }
                                        }
                                        else if (reaction.emoji.name == "⏩") {
                                            if (currentPage != 5)
                                                currentPage++;
                                            helpEmbed = new Discord.MessageEmbed().setTitle(titles[currentPage]).setColor(color).setFooter(message.guild.name);
                                            fields[currentPage].forEach(function (field) {
                                                helpEmbed.addField(field[0], field[1]);
                                            });
                                            helpMsg.edit(helpEmbed);
                                        }
                                        userReactions = helpMsg.reactions.cache.filter(function (react) { return react.users.cache.has(message.author.id); });
                                        _b.label = 1;
                                    case 1:
                                        _b.trys.push([1, 6, , 7]);
                                        _i = 0, _a = userReactions.values();
                                        _b.label = 2;
                                    case 2:
                                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                                        reaction_1 = _a[_i];
                                        return [4 /*yield*/, reaction_1.users.remove(message.author.id)];
                                    case 3:
                                        _b.sent();
                                        _b.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        error_1 = _b.sent();
                                        console.error("Failed to remove reactions.");
                                        return [3 /*break*/, 7];
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                case 7:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
