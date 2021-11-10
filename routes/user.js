import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import {
  generateHashedPassword,
  generateToken,
  verifyToken,
} from "../config/utils.js";

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const doesUserExists = await User.findOne({ email });
    if (!doesUserExists)
      return res.status(400).json(`No user with ${email} try creating one!`);

    const isPasswordValid = await bcrypt.compare(
      password,
      doesUserExists.password
    );
    if (!isPasswordValid) return res.status(400).json("Invalid password!");

    const token = generateToken(doesUserExists);

    res.status(200).header("auth-token", token).json({
      _id: doesUserExists._id,
      userName: doesUserExists.userName,
      email: doesUserExists.email,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/profile/update", verifyToken, async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    let userData = { userName, email };

    if (password) {
      const hashedPassword = await generateHashedPassword(password);
      userData = { ...userData, password: hashedPassword };
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      userData,
      { new: true }
    );
    const token = req.header("auth-token");
    res.status(200).header("auth-token", token).json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
