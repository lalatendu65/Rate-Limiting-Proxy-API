import express from "express";
import { authenticate } from "../middleware/authenticate";
import { appRegister } from "../controller/appServices.controller";

const router = express.Router();

router.post("/", authenticate, appRegister);
export default router;
