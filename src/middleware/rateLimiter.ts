import { Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../types/definitionfile";

import RateLimit from "../models/RateLimit.model";
import App from "../models/app.model";

export const rateLimiter = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appId = req.params.appId;
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return;
    }

    const app = await App.findById(appId);
    if (!app) {
      res.status(404).json({ error: "App not found" });
      return;
    }

    if (!app.rateLimit) {
      res
        .status(400)
        .json({ error: "Rate limit configuration not found for this app" });
      return;
    }

    const now = new Date();
    const windowStart = new Date(now.getTime() - app.rateLimit.window * 1000);

    let rateLimit = await RateLimit.findOne({ appId, userId });

    if (!rateLimit) {
      // Create a new rate limit entry if it doesn't exist
      rateLimit = new RateLimit({
        appId,
        userId,
        windowStart: now,
        requestCount: 1,
      });
      await rateLimit.save();
      return next();
    }

    if (rateLimit.windowStart < windowStart) {
      // Reset the rate limit window
      rateLimit.windowStart = now;
      rateLimit.requestCount = 1;
      await rateLimit.save();
      return next();
    }

    if (rateLimit.requestCount >= app.rateLimit.count) {
      // Rate limit exceeded
      res.status(429).json({ error: "Rate limit exceeded. Try again later." });
      return;
    }

    // Increment the request count
    rateLimit.requestCount += 1;
    await rateLimit.save();
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: " server error" });
  }
};
