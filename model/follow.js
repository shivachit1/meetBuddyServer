import mongoose, { Schema } from "mongoose";

// Define Follow Schema
const followSchema = new mongoose.Schema(
  {
    followerUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    followedAt: { type: Date, default: Date.now }
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id; // Rename _id to id
        delete ret._id; // Remove _id
        delete ret.__v; // Optionally remove __v field (versionKey)
      },
    },
  }
);

export const Follow = mongoose.model("Follow", followSchema);
