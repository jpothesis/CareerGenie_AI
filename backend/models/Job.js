const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true, index: true },
    location: { type: String, trim: true },
    description: { type: String, maxlength: 2000 }, 
    status: {
      type: String,
      enum: ["Wishlist", "Applied", "Interview", "Offer", "Rejected"],
      default: "Wishlist"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
