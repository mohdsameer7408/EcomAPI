import { Router } from "express";

import Order from "../models/Order.js";
import { verifyToken } from "../config/utils.js";

const router = Router();

router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "userId",
      "-password -__v -createdAt -updatedAt"
    );

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.post("/orders/create", verifyToken, async (req, res) => {
  try {
    const order = new Order({ ...req.body, userId: req.user._id });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
