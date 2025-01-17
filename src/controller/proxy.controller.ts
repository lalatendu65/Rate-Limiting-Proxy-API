import { Request, Response } from "express";
import axios from "axios";
import App from "../models/app.model";

export const proxyService = async (
  req: Request,
  res: Response
): Promise<void> => {
  const appId = req.params.appId;
  const method = req.method;
  const headers = req.headers;
  const data = req.body;
  const app = await App.findById(appId);

  if (!app) {
    res.status(404).json({ error: "App not found" });
    return;
  }

  try {
    // Forward the request to the target URL
    const options = {
      method: method,
      url: `${app.baseUrl}`,
      headers: headers,
      data,
    };
    const response = await axios(options);

    // Send the response back to the client
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: "Internal Server Error" });
  }
};
