import { Router } from "express";

import Product from "../models/Product.js";
import { verifyToken } from "../config/utils.js";
import { redisClient } from "../config/db.js";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const data = await redisClient.get("products");
    if (data) return res.status(200).json(JSON.parse(data));

    const products = await Product.find().populate(
      "sellerId",
      "-password -__v -createdAt -updatedAt"
    );
    redisClient.setEx("products", 3600, JSON.stringify(products));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.get("/products/:catogory", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.catogory,
    }).populate("sellerId", "-password -__v -createdAt -updatedAt");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.post("/products/create", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("You are not permitted to perform this operation");

    const product = new Product({ ...req.body, sellerId: req.user._id });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.patch("/product/update/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("You are not permitted to perform this operation");

    const product = await Product.findOne({ _id: req.params.id });
    if (product.sellerId.toString() !== req.user._id)
      return res.status(400).json("Your are not the seller of this product!");

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.delete("/product/delete/:id", verifyToken, async (req, res) => {
  try {
    if (req.user.userType !== "admin")
      return res
        .status(400)
        .json("You are not permitted to perform this operation");

    const product = await Product.findOne({ _id: req.params.id });
    if (product.sellerId.toString() !== req.user._id)
      return res.status(400).json("Your are not the seller of this product!");

    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
