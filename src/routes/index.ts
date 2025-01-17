import { Router } from "express";

import auth from "./auth.routes";
import proxyServices from "./proxy.routes";
import appServices from "./appServices.routes";

const router = Router();

export default () => {
  router.use("/api/v1/auth", auth);
  router.use("/api/v1/proxy", proxyServices);
  router.use("/api/v1/appServices", appServices);

  return router;
};
