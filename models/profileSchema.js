const mongoose = require("mongoose");
const { User } = require("discord.js");
const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	serverID: { type: String, require: true },
	mincoDollars: { type: Number, default: 100 },
	bank: { type: Number },
	birthday: { type: String },
	favs: {
		food: { type: String },
		color: { type: String },
		animal: { type: String },
	},
	spouse: {},
	inventory: [String],
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
