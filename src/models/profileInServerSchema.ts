import { Schema, model } from 'mongoose';

const marketSchema = new Schema({
  price: Number,
  name: String,
  desc: String
});

const logSchema = new Schema({
  type: String,
  time: Number,
  case: Number,
  date: Date,
  reason: String,
  moderator: String
});

const profileInServerSchema = new Schema({
  userID: { type: String, require: true },
  serverID: { type: String, require: true },
  market: [marketSchema],
  isShadowBanned: { type: Boolean, default: false },
  bannedFromCommands: { type: Boolean, default: false },
  bannedFromConfessions: { type: Boolean, default: false },
  logs: [logSchema]
});

const profileInServerModel = model(
  'guildProfileModel',
  profileInServerSchema
);

export default profileInServerModel;
