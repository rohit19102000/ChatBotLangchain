import mongoose from "mongoose";

const rateLimitSchema = new mongoose.Schema({
  ipAddress: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  resetTime: { type: Date }
});

const RateLimit = mongoose.model("RateLimit", rateLimitSchema);
export default RateLimit;