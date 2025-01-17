import express from "express";

import { proxyService } from "../controller/proxy.controller";

import { rateLimiter } from "../middleware/rateLimiter";
import { authenticate } from "../middleware/authenticate";

const route = express.Router();

route.use("/:appId/*", authenticate, rateLimiter, proxyService);

export default route;
