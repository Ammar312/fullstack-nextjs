import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

const connectDatabase = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "");
    connection.isConnected = db.connections[0].readyState;
    // console.log("Database: ", db);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database Connection Failed ", error);
    process.exit(1);
  }
};
export default connectDatabase;
