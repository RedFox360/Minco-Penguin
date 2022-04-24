import { Schema, model } from 'mongoose';

const zooSchema = new Schema({
	name: String,
	emoji: String
});

const profileSchema = new Schema({
	userID: { type: String, require: true, unique: true },
	mincoDollars: { type: Number, default: 100 },
	bank: { type: Number, default: 0 },
	birthday: String,
	spouse: String,
	favs: {
		food: String,
		color: String,
		animal: String
	},
	inventory: [String],
	gems: [String],
	fish: {
		rod: String,
		fishInventory: { type: Map, of: Number, default: {} },
		biome: { type: String, default: 'ocean' },
		xp: { type: Number, default: 0 }
	},
	candyAmount: Number,
	zoo: [zooSchema],
	lastUsedDaily: Number,
	lastUsedWeekly: Number,
	timezone: {
		type: String,
		default: 'America/Los_Angeles'
	}
});

const profileModel = model('ProfileModels', profileSchema);

export default profileModel;
