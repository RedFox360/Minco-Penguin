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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var cooldowns = new Map();
import profileModel from "../models/profileSchema";
import serverModel from "../models/serverSchema";
import * as Discord from "discord.js";
import * as prettyMs from "pretty-ms";
export default (function (client, message) { return __awaiter(void 0, void 0, void 0, function () {
    var profileData, guildData, profile, serverProfile, err_1, infoEmbed, prefixes, count, currentPrefix, i, prefix, args, cmd, command, i, person, currentTime, timeStamps, cooldownAmount, expTime, timeLeft_1, timeEmbed, t;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (message.author.bot)
                    return [2 /*return*/];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, , 9]);
                if (!message.guild) return [3 /*break*/, 7];
                return [4 /*yield*/, profileModel.findOne({ userID: message.author.id })];
            case 2:
                profileData = _a.sent();
                if (!!profileData) return [3 /*break*/, 4];
                return [4 /*yield*/, profileModel.create({
                        userID: message.author.id,
                        serverID: message.guild.id,
                        mincoDollars: 100,
                        bank: 0,
                        birthday: "This user's birthday has not been added to the database"
                    })];
            case 3:
                profile = _a.sent();
                profile.save();
                _a.label = 4;
            case 4: return [4 /*yield*/, serverModel.findOne({ serverID: message.guild.id })];
            case 5:
                guildData = _a.sent();
                if (!!guildData) return [3 /*break*/, 7];
                return [4 /*yield*/, serverModel.create({
                        serverID: message.guild.id,
                        bannedPeople: [],
                        blacklist: []
                    })];
            case 6:
                serverProfile = _a.sent();
                serverProfile.save();
                _a.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_1 = _a.sent();
                console.error(err_1);
                return [3 /*break*/, 9];
            case 9:
                blacklist(message);
                if (message.content.startsWith("<@!725917919292162051>")) {
                    infoEmbed = new Discord.MessageEmbed()
                        .setColor("32E6C5")
                        .setTitle("Minco Penguin")
                        .setDescription("Hello, I'm Minco Penguin! My prefixes are '!' and 'minco '");
                    message.channel.send(infoEmbed);
                    return [2 /*return*/];
                }
                prefixes = ["!", "###", "minco "];
                count = 0;
                for (i = 0; i < prefixes.length; i++) {
                    prefix = prefixes[i];
                    if (message.content.startsWith(prefix)) {
                        currentPrefix = prefix;
                        break;
                    }
                    else
                        count++;
                    if (count == prefixes.length)
                        return [2 /*return*/];
                }
                args = message.content.slice(currentPrefix.length).split(/ +/);
                cmd = args.shift().toLowerCase();
                command = client.commands.get(cmd) || client.commands.find(function (a) { return a.aliases && a.aliases.includes(cmd); });
                if (!command)
                    return [2 /*return*/];
                if (guildData.bannedPeople) {
                    for (i = 0; i < guildData.bannedPeople.length; i++) {
                        person = guildData.bannedPeople[i];
                        if (message.author.id == person) {
                            return [2 /*return*/, message.channel.send("You were banned from using Minco Penguin.")];
                        }
                    }
                }
                if (!cooldowns.has(command.name))
                    cooldowns.set(command.name, new Discord.Collection());
                currentTime = Date.now();
                timeStamps = cooldowns.get(command.name);
                cooldownAmount = command.cooldown * 1000;
                if (timeStamps.has(message.author.id)) {
                    expTime = timeStamps.get(message.author.id) + cooldownAmount;
                    if (currentTime < expTime) {
                        timeLeft_1 = expTime - currentTime;
                        timeEmbed = new Discord.MessageEmbed()
                            .setColor("RED")
                            .setTitle("Cooldown")
                            .setDescription("Please wait " + prettyMs(timeLeft_1) + " before using command " + cmd);
                        message.channel.send(timeEmbed).then(function (msg) {
                            setTimeout(function () {
                                msg["delete"]();
                            }, timeLeft_1);
                        });
                        return [2 /*return*/];
                    }
                }
                timeStamps.set(message.author.id, currentTime);
                try {
                    t = command["export"];
                    if (typeof t === "string")
                        message.channel.send(t);
                }
                catch (error) {
                    message.react("❌");
                    message.channel.send("An error occured while trying to execute this command");
                    console.error(error);
                }
                return [2 /*return*/];
        }
    });
}); });
/** @param {Discord.Message} message */
function blacklist(message) {
    if (!message.channel)
        return;
    if (message.channel.name.includes("meme"))
        return;
    if (message.channel.nsfw)
        return;
    var swearWords = [
        "f*%k".replace("*", "u").replace("%", "c"),
        "s%#t".replace("%", "h").replace("#", "i"),
        "b%t^@".replace("%", "i").replace("^", "c").replace("@", "h"),
    ];
    var bannedPhrases = __spreadArray([
        "thisworldthesedays.com",
        "tomorrowtides.com",
        "theraleighregister.com",
        "sanfransentinel.com",
        "futureme.org",
        "twitch.tv",
        "geni.us",
        "poop",
        "crap",
        "butt"
    ], swearWords);
    for (var _i = 0, bannedPhrases_1 = bannedPhrases; _i < bannedPhrases_1.length; _i++) {
        var phrase = bannedPhrases_1[_i];
        if (!message.content)
            return;
        if (message.content.toLowerCase().includes(phrase))
            return message["delete"]();
    }
}
