import { Response, NextFunction } from "express";
import { IGetUserAuthInfoRequest } from "../types/definitionfile";

import RateLimit from "../models/RateLimit.model";
import App from "../models/app.model";

const requestQueue: {
  req: IGetUserAuthInfoRequest;
  res: Response;
  next: NextFunction;
  enqueuedAt: Date;
  responded: boolean; // Track if a response has already been sent
}[] = [];

// Function to process queued requests
const processQueue = async () => {
  const now = new Date();

  while (requestQueue.length > 0) {
    const requestEntry = requestQueue[0]; // Peek at the first request
    if (requestEntry.responded) {
      requestQueue.shift(); // Remove if already responded
      continue;
    }

    const { req, res, next, enqueuedAt } = requestEntry;

    // Handle request timeout
    if (now.getTime() - enqueuedAt.getTime() > 30 * 1000) {
      res.status(503).json({ error: "Request timed out while in queue" });
      requestEntry.responded = true;
      requestQueue.shift();
      continue;
    }

    const appId = req.params.appId;
    const userId = req.user?._id;

    const app = await App.findById(appId);
    if (!app) {
      res.status(404).json({ error: "App not found" });
      requestEntry.responded = true;
      requestQueue.shift();
      continue;
    }

    if (!app.rateLimit || !app.rateLimit.count || !app.rateLimit.window) {
      res
        .status(400)
        .json({ error: "Rate limit configuration is missing or invalid" });
      requestEntry.responded = true;
      requestQueue.shift();
      continue;
    }

    const windowStart = new Date(now.getTime() - app.rateLimit.window * 1000);

    const rateLimit = await RateLimit.findOne({ appId, userId });

    if (
      rateLimit &&
      (rateLimit.requestCount < app.rateLimit.count ||
        rateLimit.windowStart < windowStart)
    ) {
      // Allow the request to proceed
      if (rateLimit.windowStart < windowStart) {
        rateLimit.windowStart = now; // Reset window
        rateLimit.requestCount = 0;
      }
      rateLimit.requestCount += 1;
      await rateLimit.save();
      requestEntry.responded = true;
      requestQueue.shift();
      next();
    } else {
      // Keep the request in the queue if rate-limited
      break;
    }
  }
};

// Schedule processing of the queue every second
setInterval(processQueue, 1000);

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
      // Rate limit exceeded; queue the request
      requestQueue.push({ req, res, next, enqueuedAt: now, responded: false });
      res.status(429).json({
        error: "Rate limit exceeded. Your request is queued.",
        position: requestQueue.length,
      });
      return;
    }

    // Increment the request count
    rateLimit.requestCount += 1;
    await rateLimit.save();
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
