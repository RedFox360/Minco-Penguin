import { Schema, model } from "mongoose";

const infractionSchema = new Schema({
	reason: { type: String, default: "No reason provided" },
	infractionType: String, // MUTE, KICK, BAN, WARN
	time: Number,
	date: Number,
});

const marketSchema = new Schema({
	price: Number,
	name: String,
	desc: String,
});

const profileInServerSchema = new Schema({
	userID: { type: String, require: true },
	serverID: { type: String, require: true },
	infractions: [infractionSchema],
	market: [marketSchema],
	muted: Boolean,
});

const profileInServerModel = model("guildProfileModel", profileInServerSchema);

export default profileInServerModel;
