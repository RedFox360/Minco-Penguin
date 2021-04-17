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
exports.execute = exports.aliases = exports.description = exports.name = void 0;
var ms = require("ms");
exports.name = "lock";
exports.description = "[ADMIN ONLY] Locks the current channel";
exports.aliases = ["unlock"];
function execute(message, args, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var mainRoleName, mainRole_1, modRole, modRole, time;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(message.member.hasPermission("ADMINISTRATOR") ||
                        message.member.roles.cache.find(function (r) { return r.name === "Moderator"; }) ||
                        message.author.id == "724786310711214118")) return [3 /*break*/, 10];
                    if (message.guild.id == "785642761814671381")
                        mainRoleName = "Student";
                    else if (message.guild.id == "804079271986462811")
                        mainRoleName = "Member";
                    else if (message.guild.id == "818509629842522112")
                        mainRoleName = "Blob";
                    else
                        return [2 /*return*/, message.channel.send("This command is invalid in this server.")];
                    return [4 /*yield*/, message.guild.roles.cache.find(function (role) { return role.name === mainRoleName; })];
                case 1:
                    mainRole_1 = _a.sent();
                    if (!!args.length) return [3 /*break*/, 6];
                    if (!(cmd === "lock")) return [3 /*break*/, 4];
                    message.channel.updateOverwrite(mainRole_1, { SEND_MESSAGES: false });
                    message.channel.send("<#" + message.channel.id + "> has been locked.");
                    if (!(message.guild.id == "785642761814671381" || message.guild.id == "804079271986462811")) return [3 /*break*/, 3];
                    return [4 /*yield*/, message.guild.roles.cache.find(function (role) { return role.name === "Moderator"; })];
                case 2:
                    modRole = _a.sent();
                    message.channel.updateOverwrite(modRole, { SEND_MESSAGES: true });
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    message.channel.updateOverwrite(mainRole_1, { SEND_MESSAGES: true });
                    message.channel.send("<#" + message.channel.id + "> has been unlocked.");
                    _a.label = 5;
                case 5: return [3 /*break*/, 9];
                case 6:
                    message.channel.updateOverwrite(mainRole_1, { SEND_MESSAGES: false });
                    message.channel.send("<#" + message.channel.id + "> has been locked.");
                    if (!(message.guild.id == "785642761814671381" || message.guild.id == "804079271986462811")) return [3 /*break*/, 8];
                    return [4 /*yield*/, message.guild.roles.cache.find(function (role) { return role.name === "Moderator"; })];
                case 7:
                    modRole = _a.sent();
                    message.channel.updateOverwrite(modRole, { SEND_MESSAGES: true });
                    _a.label = 8;
                case 8:
                    time = ms(args.join(" "));
                    if (isNaN(time))
                        return [2 /*return*/, message.reply("Enter a valid time amount")];
                    setTimeout(function () {
                        message.channel.updateOverwrite(mainRole_1, { SEND_MESSAGES: true });
                        message.channel.send("<#" + message.channel.id + "> has been unlocked.");
                    }, time);
                    _a.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    message.reply("This channel can only be used by administrators");
                    _a.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.execute = execute;
