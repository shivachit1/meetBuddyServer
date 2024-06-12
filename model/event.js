import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventType: String,
    eventTitle: String,
    eventInfo: String,
    eventStartTime: Date,
    eventEndTime: Date,
    ageLimit: {
      lowerValue: Number,
      highValue: Number,
    },
    participants: {
      option: String,
      count: Number,
    },
    coordinate: {
      latitude: Number,
      longitude: Number,
    },
    address: {
      streetName: String,
      streetNumber: String,
      postalCode: String,
      city: String,
      country: String,
    },
    categories: [String],
    coHosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    toJSON: {
      transform: function (doc, event) {
        event.id = event._id; // Rename _id to id
        delete event._id; // Remove _id
        delete event.__v; // Optionally remove __v field (versionKey)
      },
    },
  }
);

export const Event = mongoose.model("Event", eventSchema);
