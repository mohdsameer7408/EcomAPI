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
    const { userName, email, password } = req.body;

    const doesUserExists = await User.findOne({ email });
    if (doesUserExists)
      return res
        .status(400)
        .json(`A user with ${email} already exists try signing in!`);

    let name = userName ? userName : email.split("@", 1)[0];
    const hashedPassword = await generateHashedPassword(password);
    const user = new User({
      userName: name,
      email,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    const token = generateToken(createdUser);

    res.status(201).header("auth-token", token).json({
      _id: createdUser._id,
      userName: createdUser.userName,
      email: createdUser.email,
      userType: createdUser.userType,
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
      return res
        .status(400)
        .json(`No user exists with ${email} try creating one!`);

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
      userType: doesUserExists.userType,
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
      userType: updatedUser.userType,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/profile/reset-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, password } = req.body;
    const user = await User.findById(req.user._id);
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid)
      return res.status(400).json(`Current password dosen't match!`);

    const hashedPassword = await generateHashedPassword(password);
    user.password = hashedPassword;

    const updatedUser = await user.save();
    const token = req.header("auth-token");

    res.status(200).header("auth-token", token).json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      userType: updatedUser.userType,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.get("/user/auto-login", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const token = req.header("auth-token");

    res.status(200).header("auth-token", token).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      userType: user.userType,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
