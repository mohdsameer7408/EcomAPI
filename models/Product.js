import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const productSchema = new mongoose.Schema(
  {
    name: schemaOptions,
    imageUrl: schemaOptions,
    desciption: schemaOptions,
    category: schemaOptions,
    price: schemaOptions,
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
