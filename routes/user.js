import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";

const router = Router();

router.get("/register", async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
