import dotenv from "dotenv";

import connectDB from "./src/db/dbConnection.js";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());


const startServer = async () => {
  await connectDB(); 
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

startServer();

// routes imports
import userRouters from "./src/routes/user.Routes.js";
import vehicleRouters from "./src/routes/vehicle.Routes.js";
// user routes
app.use("/api/v1/users", userRouters);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRouters);

