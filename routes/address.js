import { Router } from "express";

import { verifyToken } from "../config/utils.js";
import Address from "../models/Address.js";

const router = Router();

router.get("/addresses", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id }).populate(
      "userId",
      "-password -__v -createdAt -updatedAt"
    );

    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
