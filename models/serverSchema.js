const mongoose = require("mongoose");
const serverSchema = new mongoose.Schema({
	serverID: { type: String, require: true, unique: true },
	bannedPeople: [String],
	blacklist: [String],
	chest: {
		hasChest: { type: Boolean, default: false },
		mdAmount: Number,
		userDropped: String,
		usersClaimed: [String],
	},
	welcomeChannel: String,
	silenceJoins: { type: Boolean, default: false },
	silenceBans: { type: Boolean, default: false },
});

const model = mongoose.model("SeverModels", serverSchema);

module.exports = model;
