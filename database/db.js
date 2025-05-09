import { connect } from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectToMongo = async () => {
    try {
        await connect(process.env.MONGODB_URI, {
            dbName: "Oil_wallah", // This is the name of your database
        });
        console.log("---***Database Connected Successfully***---");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error);
    }
}

export default connectToMongo;
