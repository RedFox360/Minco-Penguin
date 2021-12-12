import { Schema, model } from "mongoose";

const zooSchema = new Schema({
	name: String,
	emoji: String,
});

const profileSchema = new Schema({
	userID: { type: String, require: true, unique: true },
	mincoDollars: { type: Number, default: 100 },
	bank: { type: Number, default: 0 },
	birthday: String,
	favs: {
		food: String,
		color: String,
		animal: String,
	},
	spouse: String,
	inventory: [String],
	fish: {
		cookedCods: { type: Number, default: 0 },
		cookedSalmons: { type: Number, default: 0 },
		cods: { type: Number, default: 0 },
		salmons: { type: Number, default: 0 },
		pufferfish: { type: Number, default: 0 },
		clownfish: { type: Number, default: 0 },
		axolotls: { type: Number, default: 0 },
		xp: { type: Number, default: 0 },
		baits: { type: Number, default: 0 },
		baitType: String,
	},
	rod: String,
	gems: [String],
	candyAmount: Number,
	zoo: [zooSchema],
	penguin: String,
	lastUsedDaily: Number,
	lastUsedWeekly: Number,
	timezone: { type: String, default: "America/Los_Angeles" },
});

const profileModel = model("ProfileModels", profileSchema);

export default profileModel;
