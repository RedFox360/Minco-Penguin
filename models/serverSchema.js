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
	welcomeMessage: {
		type: String,
		default: "Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!",
	},
	leaveMessage: {
		type: String,
		default: "It seems {user_tag} has left us. We now have {member_count} members.",
	},
	silenceJoins: { type: Boolean, default: false },
	silenceBans: { type: Boolean, default: false },
	muteRole: String,
	mainRole: String,
	modRole: String,
});

const model = mongoose.model("SeverModels", serverSchema);

module.exports = model;
