
import app from "./app.js";
//@ts-ignore
import { connectDB } from "@packages"



try {
    const db = await connectDB(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string);
    console.log("Connected to database starting  admin server");
    const PORT = process.env.PORT ;
    app.listen(PORT, () => {
        console.log(`Admin server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);    
}




