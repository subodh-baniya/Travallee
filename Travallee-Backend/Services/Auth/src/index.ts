//@ts-ignore
import { connectDB } from "@packages";
import app from "./app.js";

const startServer = async () => {
    try {
        await connectDB(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string);
        console.log("Database connection established and established successfully. Starting Auth service...");
    
        app.listen(process.env.PORT_AUTH, () => {
            console.log(`Server is running on port ${process.env.PORT_AUTH}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

startServer();

