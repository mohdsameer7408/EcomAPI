import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import { generateHashedPassword, generateToken } from "../config/utils.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doesUserExists = await User.findOne({ email });
    if (doesUserExists)
      return res
        .status(400)
        .json(`A user with ${email} already exists try signing in!`);

    const userName = email.split("@", 1)[0];
    const hashedPassword = await generateHashedPassword(password);
    const user = new User({ userName, email, password: hashedPassword });
    const createdUser = await user.save();
    const token = generateToken(createdUser);

    res.status(201).header("auth-token", token).json({
      _id: createdUser._id,
      userName: createdUser.userName,
      email: createdUser.email,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
