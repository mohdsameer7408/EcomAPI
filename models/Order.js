import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        productId: schemaOptions,
        name: schemaOptions,
        imageUrl: schemaOptions,
        quantity: schemaOptions,
        price: schemaOptions,
      },
    ],
    totalQuantity: schemaOptions,
    total: schemaOptions,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
