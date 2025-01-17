import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { generateTokens } from "../utils/generateApiKey";
// register for new user
export const userRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already exists" });
      return;
    }

    const lastUser = await User.findOne().sort({ userId: -1 }).lean();
    const lastNumber =
      lastUser && lastUser.userId
        ? parseInt(lastUser.userId.substring(2), 10)
        : 0;
    const newUserId = `UL${(lastNumber + 1).toString().padStart(4, "0")}`;

    // Create the new user
    const user = new User({
      email,
      name,
      userId: newUserId,
    });

    // Generate an API key (JWT token)
    const apiKey = generateTokens({ _id: user._id }); // Default role is "user"

    // Save the user to the database
    user.apiKey = apiKey;
    await user.save();
    res
      .status(200)
      .json({ message: "user register successFully ", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
