import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: any; // Extend with the custom 'user' field
}
