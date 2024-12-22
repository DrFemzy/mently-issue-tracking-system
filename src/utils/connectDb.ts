import mongoose, { ConnectOptions } from "mongoose";
import { MONGO_DB_CONNECTION_STRING } from "../environment";

mongoose
  .connect(MONGO_DB_CONNECTION_STRING, {} as ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB: ", error);
  });
