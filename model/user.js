import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    userName: String,
    bio: String,
    imageUrl: String,
  },
  {
    toJSON: {
      transform: function (doc, user) {
        user.id = user._id; // Rename _id to id
        delete user._id; // Remove _id
        delete user.__v; // Optionally remove __v field (versionKey)
      },
    },
  }
);

export const User = mongoose.model("User", userSchema);
