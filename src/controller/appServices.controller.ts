import { Request, Response, NextFunction } from "express";
import App from "../models/app.model";
import { IGetUserAuthInfoRequest } from "../types/definitionfile";

// register for application
export const appRegister = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, baseUrl, rateLimit } = req.body;
    const { count, window } = rateLimit;

    const app = new App({
      name,
      baseUrl,
      rateLimit: { count, window },
      owner: req.user!.id,
    });

    await app.save();
    res.status(201).json({ appId: app.id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
