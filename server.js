import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

const app = express();

// routes
import adminRouter from "./routes/adminRouter.js";
import studentRouter from "./routes/studentRouter.js";
import candidateRouter from "./routes/candidateRouter.js";
import logoutRouter from "./routes/logoutRouter.js";
import userRouter from "./routes/userRouter.js";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/candidate", candidateRouter);
app.use("/api/user", userRouter);
app.use("/api/logout", logoutRouter);

app.get("/api/v1/test", (req, res) => {
  res.json({ msg: "test " });
});

app.use("*", (req, res) => {
  res.status(404).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
