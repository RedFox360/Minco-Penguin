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

const baits = new Schema({
	worms: Number,
	leeches: Number,
	bugs: Number,
	fishes: Number,
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
	fish: [String], // 01: Cod, 02: Salmon, 03: Pufferfish, 04: Clownfish, 05: Axolotl
	rod: { type: String, default: "normal" }, // normal, metal, heavy, lava, ruby, diamond, emerald, legendary gemstone
	gems: [String],
	candyAmount: Number,
	zoo: [zooSchema],
	penguin: String,
	market: [marketSchema],
	lastUsedDaily: Number,
	lastUsedWeekly: Number,
	baits,
});

const profileModel = model("ProfileModels", profileSchema);

export default profileModel;
