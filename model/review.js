import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    reviewerUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    reviewScore: Number,
  },
  {
    toJSON: {
      transform: function (doc, review) {
        review.id = fav._id; // Rename _id to id
        delete fav._id; // Remove _id
        delete fav.__v; // Optionally remove __v field (versionKey)
      },
    },
  }
);

export const Review = mongoose.model("Review", reviewSchema);
