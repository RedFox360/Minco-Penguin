import * as mongoose from "mongoose";
const serverSchema = new mongoose.Schema({
	serverID: { type: String, require: true, unique: true }
	bannedPeople: { type: Array }
	blacklist: { type: Array }
});

export default mongoose.model("SeverModels", serverSchema);
