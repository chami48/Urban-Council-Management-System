const mongoose = require("mongoose");

const PlaygroundSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    organizerName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    phone: { type: String, required: true, trim: true },

    playgroundType: { type: String, required: true, trim: true },
    expectedAttendees: { type: Number, required: true, min: 1 },

    eventDate: { type: Date, required: true },

    startTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:mm"],
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be HH:mm"],
    },
    specialRequirement: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    comment: { type: String, default: "", trim: true },
    statusUpdatedAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes for useful queries
PlaygroundSchema.index({ eventDate: 1 });
PlaygroundSchema.index({ eventDate: 1, playgroundType: 1 });

module.exports = mongoose.model("Playground", PlaygroundSchema);
