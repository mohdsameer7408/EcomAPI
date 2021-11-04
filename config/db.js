import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const DBUri = `mongodb+srv://root:${process.env.PASS}@cluster0.hltf8.mongodb.net/ecomDB?retryWrites=true&w=majority`;
    // database connection
    const conn = await mongoose.connect(DBUri, { autoIndex: false });
    console.log(`MongoDB connected:${conn.connection.host}`);

    // storage connection
    const gfsConn = await mongoose
      .createConnection(DBUri, {
        autoIndex: false,
      })
      .asPromise();
    console.log(`MongoDB storage connected:${gfsConn.host}`);
  } catch (error) {
    console.log(`Error while connecting with MongoDB: ${error}`);
  }
};

export default connectDB;
