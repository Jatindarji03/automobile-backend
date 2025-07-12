import dotenv from "dotenv";
dotenv.config();
import connectDB from "./src/db/dbConnection.js";
import express from "express";


const app = express();
app.use(express.json());

const startServer = async () => {
  await connectDB(); 
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
};

startServer();