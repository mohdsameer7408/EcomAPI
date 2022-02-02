import { Router } from "express";

import Order from "../models/Order.js";
import { verifyToken } from "../config/utils.js";

const router = Router();

router.get("/orders", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate(
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
    let totalQuantity = 0,
      total = 0;
    req.body.orderItems.forEach((orderItem) => {
      const { quantity, price } = orderItem;

      totalQuantity += parseInt(quantity);
      total += parseInt(quantity) * parseFloat(price);
    });

    const order = new Order({
      ...req.body,
      totalQuantity: totalQuantity.toString(),
      total: total.toString(),
      userId: req.user._id,
    });
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.delete("/orders/delete/:orderId", verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId });
    if (order.userId.toString() !== req.user._id)
      return res
        .status(400)
        .json("The order you are trying to delete is not yours!");

    const deletedOrder = await Order.findOneAndDelete({
      _id: req.params.orderId,
    });
    res.status(200).json(deletedOrder);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});
export default router;
