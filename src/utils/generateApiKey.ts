import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (user: any) => {
  const payload = { _id: user._id };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {
    expiresIn: "30d", // Short-lived access token
  });

  return accessToken;
};
