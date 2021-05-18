const mongoose = require("mongoose");

const zooSchema = new mongoose.Schema({
	name: { type: String },
	emoji: { type: String },
});

const marketSchema = new mongoose.Schema({
	number: Number,
	price: Number,
	name: String,
	desc: String,
});

const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	serverID: { type: String, require: true },
	mincoDollars: { type: Number, default: 100 },
	bank: Number,
	birthday: String,
	favs: {
		food: { type: String },
		color: { type: String },
		animal: { type: String },
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
		battleShield: Boolean,
	},
	market: [marketSchema],
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
