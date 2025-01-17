import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
});

const User = mongoose.model("User", userSchema);
export default User;
