import { connect } from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const connectToMongo = async () => {
    try {
        await connect(process.env.MONGODB_URI, {
            dbName: "Oil_wallah",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("---***Database Connected Successfully***---");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        // Add retry logic
        setTimeout(() => connectToMongo(), 5000);
    }
}

export default connectToMongo;