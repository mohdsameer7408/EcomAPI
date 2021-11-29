import mongoose from "mongoose";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import path from "path";
import Pusher from "pusher";

let gfs, upload;

const connectDB = async () => {
  try {
    const DBUri = `mongodb+srv://root:${process.env.PASS}@cluster0.hltf8.mongodb.net/ecomDB?retryWrites=true&w=majority`;

    // pusher configuration
    const pusher = new Pusher({
      appId: "1307350",
      key: "36fbaf9e90fc929ed231",
      secret: "8dc1544a6a2fe37009b9",
      cluster: "mt1",
      useTLS: true,
    });

    // database connection
    const conn = await mongoose.connect(DBUri, { autoIndex: false });
    console.log(`MongoDB connected:${conn.connection.host}`);

    // storage connection
    const fileConn = await mongoose
      .createConnection(DBUri, {
        autoIndex: false,
      })
      .asPromise();
    console.log(`MongoDB storage connected:${fileConn.host}`);

    gfs = new mongoose.mongo.GridFSBucket(fileConn.db, {
      bucketName: "images",
    });

    const storage = new GridFsStorage({
      url: DBUri,
      options: { useNewUrlParser: true, useUnifiedTopology: true },
      file: (req, file) =>
        new Promise((resolve, reject) => {
          const fileName = `IMG-${Date.now()}${path.extname(
            file.originalname
          )}`;
          const fileInfo = {
            filename: fileName,
            bucketName: "images",
          };

          resolve(fileInfo);
        }),
    });

    upload = multer({ storage });

    // making mongoDB realtime
    const userChangeStream = mongoose.connection.collection("users").watch();
    userChangeStream.on("change", (change) => {
      console.log("Change stream was triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A user was created!");
        pusher.trigger("users", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A user was updated or deleted!");
        pusher.trigger("users", "inserted", change.documentKey);
      } else {
        console.log("An unknown operation was triggered!");
      }
    });
    const orderChangeStream = mongoose.connection.collection("orders").watch();
    orderChangeStream.on("change", (change) => {
      console.log("Change stream was triggered!");
      console.log(change);

      if (change.operationType === "insert") {
        const data = change.fullDocument;
        console.log("A user was created!");
        pusher.trigger("users", "inserted", data);
      } else if (
        change.operationType === "update" ||
        change.operationType === "delete"
      ) {
        console.log("A user was updated or deleted!");
        pusher.trigger("users", "inserted", change.documentKey);
      } else {
        console.log("An unknown operation was triggered!");
      }
    });
  } catch (error) {
    console.log(`Error while connecting with MongoDB: ${error}`);
  }
};

export { gfs, upload };
export default connectDB;
