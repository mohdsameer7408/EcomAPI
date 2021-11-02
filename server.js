import express from "express";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).json("Hello world"));

app.listen(PORT, () => console.log(`Listening on localhost:${PORT}`));
