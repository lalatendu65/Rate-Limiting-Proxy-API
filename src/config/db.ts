import mongoose, { ConnectOptions } from "mongoose";

// Define the type for the database URL
type DB_URL_Type = string;

// DB connection function
const connectToDatabase = (DB_URL: DB_URL_Type): void => {
  mongoose
    .connect(DB_URL, {} as ConnectOptions)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.error("Error in connecting to DB: " + err);
    });

  mongoose.connection.on("error", (err) => {
    console.error("Database connection error: " + err);
  });
};

export default connectToDatabase;
