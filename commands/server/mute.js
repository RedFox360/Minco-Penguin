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
import * as ms from "ms";
export var name = "mute";
export var aliases = ["unmute"];
export var description = "[ADMIN ONLY] Mutes a member";
export var usage = "!mute <@user> <time> <reason>";
export function execute(message, args, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var roles, target, mainRole_1, muteRole_1, memberTarget_1, description, muteEmbed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (message.guild.id == "785642761814671381")
                        roles = ["Student", "Muted"];
                    else if (message.guild.id == "804079271986462811")
                        roles = ["Member", "Muted"];
                    else if (message.guild.id == "818509629842522112")
                        roles = ["Blob", "Muted"];
                    else
                        return [2 /*return*/, message.channel.send("The mute command is invalid in this server")];
                    if (!((message.member.hasPermission("MANAGE_MESSAGES") && message.member.roles.cache.find(function (r) { return r.name === "Moderator"; })) ||
                        message.member.hasPermission("MANAGE_ROLES") ||
                        message.author.id == "802668636795830292")) return [3 /*break*/, 4];
                    target = message.mentions.users.first();
                    if (!target)
                        return [2 /*return*/, message.channel.send("Mention a valid user")];
                    return [4 /*yield*/, message.guild.roles.cache.find(function (role) { return role.name === roles[0]; })];
                case 1:
                    mainRole_1 = _a.sent();
                    return [4 /*yield*/, message.guild.roles.cache.find(function (role) { return role.name === roles[1]; })];
                case 2:
                    muteRole_1 = _a.sent();
                    return [4 /*yield*/, message.guild.members.cache.get(target.id)];
                case 3:
                    memberTarget_1 = _a.sent();
                    if (memberTarget_1.user.bot)
                        return [2 /*return*/, "Bots cannot be muted"];
                    if (memberTarget_1.hasPermission("ADMINISTRATOR") ||
                        memberTarget_1.hasPermission("MANAGE_CHANNELS") ||
                        memberTarget_1.roles.cache.find(function (r) { return r.name === "Moderator"; }) ||
                        memberTarget_1.id == "724786310711214118")
                        return [2 /*return*/, "<@" + memberTarget_1.id + "> cannot be muted"];
                    description = "<@" + memberTarget_1.user.id + "> has been muted";
                    if (args[1])
                        description += " for " + args[1];
                    muteEmbed = new Discord.MessageEmbed()
                        .setColor("#F04747")
                        .setTitle("Mute Warning")
                        .setDescription(description)
                        .setAuthor(memberTarget_1.user.username)
                        .setThumbnail(memberTarget_1.user.avatarURL());
                    if (cmd === "mute") {
                        memberTarget_1.roles.remove(mainRole_1.id);
                        memberTarget_1.roles.add(muteRole_1.id);
                        message.channel.send(muteEmbed);
                        if (!args[1])
                            return [2 /*return*/];
                        setTimeout(function () {
                            memberTarget_1.roles.remove(muteRole_1.id);
                            memberTarget_1.roles.add(mainRole_1.id);
                            message.channel.send("<@" + memberTarget_1.user.id + "> has been unmuted.");
                        }, ms(args[1]));
                    }
                    else if (cmd === "unmute") {
                        memberTarget_1.roles.remove(muteRole_1.id);
                        memberTarget_1.roles.add(mainRole_1.id);
                        message.channel.send("<@" + memberTarget_1.user.id + "> has been unmuted.");
                        return [2 /*return*/];
                    }
                    return [3 /*break*/, 5];
                case 4: return [2 /*return*/, "You don't have the right permissions to execute this command."];
                case 5: return [2 /*return*/];
            }
        });
    });
}
