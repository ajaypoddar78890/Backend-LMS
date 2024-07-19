import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

const PORT = process.env.PORT || 5500;

//config
const app = express();
dotenv.config();

// middlewere
app.use(morgan("dev"));
app.use(express.json());

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(
  cors({
    origin: [
      "https://deals4wheelss.onrender.com",
      "https://deals4wheelss.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

//connecting to the DB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to MONGODB");
  } catch (error) {
    console.log(error);
  }
};

//Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.listen(PORT, () => {
  connect();
  console.log("this app is ruuning at 5500");
});
