const mongoose = require("mongoose");

const zooSchema = new mongoose.Schema({
	name: String,
	emoji: String,
});

const marketSchema = new mongoose.Schema({
	price: Number,
	name: String,
	desc: String,
});

const profileSchema = new mongoose.Schema({
	userID: { type: String, require: true, unique: true },
	mincoDollars: { type: Number, default: 100 },
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
	penguin: String,
	market: [marketSchema],
	lastUsedDaily: Number,
	cooldowns: Map,
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
