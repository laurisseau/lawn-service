import userRoutes from "./Routes/userRoutes.js";
import paymentRoutes from "./Routes/paymentRoutes.js"
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";


dotenv.config({ path: "config.env" });

const app = express();
const port = 5000 || process.env.PORT;

app.use(cors());

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
/*
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});
*/

app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next);  // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/users", userRoutes);
app.use("/", paymentRoutes)


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/frontend/build/index.html"));
});

app.listen(port, () => {
  console.log(`connected to ${port}`);
});
