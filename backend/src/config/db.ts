import mongoose from "mongoose";
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to Miadak Database !");
  } catch (err) {
    console.log("Err connecting to database", err);
  }
};

export default connectToDB;
