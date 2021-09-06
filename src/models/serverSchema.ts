import { Schema, model } from "mongoose";
const serverSchema = new Schema({
	serverID: { type: String, require: true, unique: true },
	prefixes: [String],
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
		default:
			"Welcome to {server}, {mention}!\nYou are the {ord_member_count} member!",
	},
	leaveMessage: {
		type: String,
		default:
			"It seems {user_tag} has left us. We now have {member_count} members.",
	},
	sendBirthdays: { type: Boolean, default: true },
	birthdayChannel: String,
	welcomeDM: String,
	memberCount: Number,
	silenceJoins: { type: Boolean, default: false },
	silenceBans: { type: Boolean, default: false },
	muteRole: String,
	mainRole: String,
	modRole: String,
	botRole: String,
	starboard: {
		channelID: String,
		starAmount: Number,
	},
	clean: { type: Boolean, default: true },
	timezone: { type: String, default: "America/Los_Angeles" },
});

const serverModel = model("SeverModels", serverSchema);

export default serverModel;
