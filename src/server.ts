require("dotenv").config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
const app = express();

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL;

mongoose.connect(DB_URL as string, (error: any) => {
  if (error) {
    return console.log(error);
  }

  console.log("Connected to DB");
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/auth"));
app.use("/bugs", require("./routes/bugs"));
app.use("/user", require("./routes/user"));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
