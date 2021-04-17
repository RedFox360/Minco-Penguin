"use strict";
exports.__esModule = true;
var mongoose = require("mongoose");
var serverSchema = new mongoose.Schema({
    serverID: { type: String, require: true, unique: true },
    bannedPeople: { type: Array },
    blacklist: { type: Array }
});
exports["default"] = mongoose.model("SeverModels", serverSchema);
