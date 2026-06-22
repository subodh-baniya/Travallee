import {server} from "./app.js";
import { connectDB } from "./config/Func/connect.db.js"
import "./controller/Superadmin/add.controller.js";



try {
    const db = await connectDB(process.env.MONGO_URI as string, process.env.MONGO_DB_NAME as string);
    console.log("Connected to database starting  admin server");
    const PORT = process.env.PORT ;
    server.listen(PORT, () => {
        console.log(`socket server is running on port ${PORT}`);
    });
} catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);    
}




