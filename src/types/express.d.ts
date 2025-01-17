import * as express from "express"; // Adjust the path to match your project structure

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace UserDocument with the type from your User model
    }
  }
}
