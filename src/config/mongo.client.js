import mongoose from "mongoose";

const client = async () => {
  const mongoURI = process.env.MONGO_URI;

  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB 🍃");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1); // Exit process with failure
  }
};

export default client;
