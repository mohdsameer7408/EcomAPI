import { Router } from "express";

import Product from "../models/Product.js";
import { verifyToken } from "../config/utils.js";

const router = Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
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

    const product = new Product(req.body);
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

    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(200).json(deletedProduct);
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

export default router;
