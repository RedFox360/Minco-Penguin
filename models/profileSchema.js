const mongoose = require("mongoose");

const zooSchema = new mongoose.Schema({
	name: String,
	emoji: String,
});

const marketSchema = new mongoose.Schema({
	orbs: Boolean,
	price: Number,
	name: String,
	desc: String,
});

const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	serverID: { type: String, require: true },
	mincoDollars: { type: Number, default: 100 },
	orbs: { type: Number, default: 0 },
	bank: Number,
	birthday: String,
	favs: {
		food: String,
		color: String,
		animal: String,
	},
	spouse: String,
	inventory: [String],
	gems: [String],
	candyAmount: Number,
	zoo: [zooSchema],
	battle: {
		attack: Number,
		defense: Number,
		health: { type: Number, default: 100 },
	},
	market: [marketSchema],
	lastUsedDaily: Number,
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
