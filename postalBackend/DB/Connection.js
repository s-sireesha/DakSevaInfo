import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

const DBconnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Atlas connection established ✅");
  } catch (error) {
    console.log(`Error is: ${error.message}`);
    process.exit(1);
  }
};

export { DBconnection };
