

import connectDB from "./src/db/dbConnection.js";

connectDB()
  .then(() => console.log("Database connection established"))
    .catch((error) => console.error("Database connection error:", error));