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
import serviceCenterRouters from "./src/routes/serviceCenter.routes.js";
import hardwareShopRouters from "./src/routes/hardwareShop.routes.js";
import categoryRouters from "./src/routes/category.routes.js";
import productRouters from "./src/routes/product.routes.js";
// user routes
app.use("/api/v1/users", userRouters);

// vehicle routes
app.use("/api/v1/vehicles", vehicleRouters);

// service center routes
app.use("/api/v1/service-centers", serviceCenterRouters);

//Hardware Shop routes
app.use("/api/v1/hardware-shops", hardwareShopRouters);

//Category routes
app.use("/api/v1/categories", categoryRouters);

//Product routes
app.use("/api/v1/products", productRouters);

