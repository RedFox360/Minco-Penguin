import { Schema, model } from "mongoose";

const zooSchema = new Schema({
	name: String,
	emoji: String,
});

const marketSchema = new Schema({
	price: Number,
	name: String,
	desc: String,
});

const profileSchema = new Schema({
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
});

const profileModel = model("ProfileModels", profileSchema);

export default profileModel;
