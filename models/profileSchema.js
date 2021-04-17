import * as mongoose from "mongoose";
var profileSchema = new mongoose.Schema({
    userID: { type: String, require: true, unique: true },
    serverID: { type: String, require: true },
    mincoDollars: { type: Number, "default": 100 },
    bank: { type: Number },
    birthday: { type: String },
    favs: {
        food: { type: String },
        color: { type: String },
        animal: { type: String }
    }
});
export default mongoose.model("ProfileModels", profileSchema);
