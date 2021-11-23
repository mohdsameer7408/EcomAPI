import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
};

const addressSchema = new mongoose.Schema(
  {
    name: schemaOptions,
    area: schemaOptions,
    city: schemaOptions,
    state: schemaOptions,
    zipCode: schemaOptions,
    country: schemaOptions,
    mobile: schemaOptions,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
