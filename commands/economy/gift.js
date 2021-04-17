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
export var name = "gift";
export var description = "Gift an amount of coins to a user";
export var usage = "!gift <@user> <number>";
export var cooldown = 3;
export function execute(message, args, _0, _1, profileData) {
    return __awaiter(this, void 0, void 0, function () {
        var mention, amount, userData, profile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mention = message.mentions.users.first();
                    if (!mention)
                        return [2 /*return*/, "Mention a valid user"];
                    amount = parseInt(args[1]);
                    if (isNaN(amount))
                        return [2 /*return*/, "Enter a valid number"];
                    if (amount <= 0)
                        return [2 /*return*/, "You must gift a positive integer"];
                    if (amount > profileData.mincoDollars)
                        return [2 /*return*/, "You don't have " + amount + " dollars"];
                    return [4 /*yield*/, profileModel.findOne({ userID: mention.id })];
                case 1:
                    userData = _a.sent();
                    if (!!userData) return [3 /*break*/, 3];
                    return [4 /*yield*/, profileModel.create({
                            userID: mention.id,
                            serverID: message.guild.id,
                            mincoDollars: 100,
                            bank: 0
                        })];
                case 2:
                    profile = _a.sent();
                    profile.save();
                    _a.label = 3;
                case 3: return [4 /*yield*/, profileModel.findOneAndUpdate({ userID: message.author.id }, {
                        $inc: {}
                    })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, profileModel.findOneAndUpdate({ userID: mention.id }, {
                            $inc: {
                                mincoDollars: amount
                            }
                        })];
                case 5:
                    _a.sent();
                    message.channel.send("You gifted " + amount + " Minco Dollars to <@" + mention.id + ">");
                    return [2 /*return*/];
            }
        });
    });
}
