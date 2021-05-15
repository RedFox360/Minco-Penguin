const mongoose = require("mongoose");
const serverSchema = new mongoose.Schema({
	serverID: { type: String, require: true, unique: true },
	bannedPeople: [String],
	blacklist: [String],
});

const model = mongoose.model("SeverModels", serverSchema);

module.exports = model;
