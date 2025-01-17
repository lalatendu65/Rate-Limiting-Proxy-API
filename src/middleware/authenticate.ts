import { Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../types/definitionfile";
import User from "../models/user.model";

export const authenticate = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let apiKey = req.headers.authorization?.replace("Bearer ", "");
  if (!apiKey) {
    res.status(401).json({ error: "API key is required" });
    return;
  }
  const user = await User.findOne({ apiKey });
  if (!user) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  req.user = user; // Attach user to the request

  next();
};
