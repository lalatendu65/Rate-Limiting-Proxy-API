import mongoose from "mongoose";
const options = {
  timestamps: true,
  versionKey: false,
};

const rateLimitSchema = new mongoose.Schema(
  {
    appId: { type: mongoose.Schema.Types.ObjectId, ref: "App", required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    windowStart: { type: Date, required: true },
    requestCount: { type: Number, default: 0 },
  },
  options
);

rateLimitSchema.index({ appId: 1, userId: 1 }, { unique: true });

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);
export default RateLimit;
