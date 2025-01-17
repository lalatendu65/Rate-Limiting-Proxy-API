import { Request } from "express";
// Adjust based on your actual User model type

export interface IGetUserAuthInfoRequest extends Request {
  user?: any; // Extend with the custom 'user' field
}
