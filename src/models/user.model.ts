import mongoose from "mongoose";
const options = {
  timestamps: true,
  versionKey: false,
};

const userSchema = new mongoose.Schema(
  {
    userId: { type: String },
    name: { type: String },
    email: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true, unique: true },
  },
  options
);

const User = mongoose.model("User", userSchema);
export default User;
