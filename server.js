import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/db/dbConnection.js";
import express from "express";
import cookieParser from "cookie-parser";
import { app, server, io } from "./src/Socket/socket.js";
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//   origin: ["http://localhost:5174", "http://localhost:5173"], // ✅ Array of allowed origins
//   credentials: true, // ✅ Allow cookies (needed for sessions/auth)
// }));

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


const startServer = async () => {
  await connectDB(); 
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

startServer();

// routes imports
import userRouters from "./src/routes/user.Routes.js";
import vehicleRouters from "./src/routes/vehicle.Routes.js";
import serviceCenterRouters from "./src/routes/serviceCenter.routes.js";
// user routes
app.use("/api/v1/users", userRouters);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRouters);

// service center routes
app.use("/api/v1/service-centers", serviceCenterRouters);
