import { Schema, model } from "mongoose";

const zooSchema = new Schema({
	name: String,
	emoji: String,
});

const baits = new Schema({
	worms: Number,
	leeches: Number,
	bugs: Number,
	fishes: Number,
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
	market: [marketSchema],
	fish: [String], // 01: Cod, 02: Salmon, 03: Pufferfish, 04: Clownfish, 05: Axolotl
	rod: { type: String, default: "normal" }, // normal, metal, heavy, lava, ruby, diamond, emerald, legendary gemstone
	gems: [String],
	candyAmount: Number,
	zoo: [zooSchema],
	penguin: String,
	lastUsedDaily: Number,
	lastUsedWeekly: Number,
	timezone: { type: String, default: "America/Los_Angeles" },
	baits,
});

const profileModel = model("ProfileModels", profileSchema);

export default profileModel;
