import mongoose from "mongoose";

const schemaOptions = {
  type: String,
  required: true,
  unique: true,
};

const userSchema = new mongoose.Schema(
  {
    userName: schemaOptions,
    email: schemaOptions,
    password: { ...schemaOptions, unique: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
