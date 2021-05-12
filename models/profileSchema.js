const mongoose = require("mongoose");
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
	spouse: { type: String },
	inventory: [String],
	candyAmount: { type: Number },
});

const model = mongoose.model("ProfileModels", profileSchema);

module.exports = model;
