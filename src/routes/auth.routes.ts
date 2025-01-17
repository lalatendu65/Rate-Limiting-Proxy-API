import express from "express";
import { userRegister } from "../controller/auth.controller";

const router = express.Router();
router.post("/register", userRegister);

export default router;
