import express from "express";
import cors from "cors";

// configuration
const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());

// endpoints
app.get("/", (req, res) => res.status(200).json("Hello world"));

// listener
app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));
