import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const productSchema = new mongoose.Schema(
  {
    name: schemaOptions,
    imageUrl: schemaOptions,
    description: schemaOptions,
    category: schemaOptions,
    price: schemaOptions,
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
