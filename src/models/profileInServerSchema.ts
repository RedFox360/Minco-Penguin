import { Schema, model } from "mongoose";

const marketSchema = new Schema({
	price: Number,
	name: String,
	desc: String,
});

const profileInServerSchema = new Schema({
	userID: { type: String, require: true },
	serverID: { type: String, require: true },
	market: [marketSchema],
	isShadowBanned: { type: Boolean, default: false },
});

const profileInServerModel = model("guildProfileModel", profileInServerSchema);

export default profileInServerModel;
