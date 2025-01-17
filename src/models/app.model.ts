import mongoose from "mongoose";

const appSchema = new mongoose.Schema({
  name: { type: String, required: true },
  baseUrl: { type: String, required: true },
  rateLimitStrategy: {
    type: String,
    enum: ["fixedWindow", "slidingWindow"],
    default: "fixedWindow",
  },

  rateLimit: {
    count: { type: Number, required: true },
    window: { type: Number, required: true }, // In seconds
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const App = mongoose.model("App", appSchema);
export default App;
