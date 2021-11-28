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

router.post("/addresses/create", verifyToken, async (req, res) => {
  try {
    const address = new Address({ ...req.body, userId: req.user._id });
    const createdAddress = await address.save();

    res.status(201).json(createdAddress);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/addresses/update/:id", verifyToken, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id });
    if (address.userId.toString() !== req.user._id)
      return res.status(400).json(`Not allowed!`);

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAddress);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.delete("/addresses/delete/:id", verifyToken, async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id });
    if (address.userId.toString() !== req.user._id)
      return res.status(400).json(`Not allowed!`);

    const deletedAddress = await Address.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json(deletedAddress);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
