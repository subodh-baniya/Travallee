//@ts-ignore
import { connectDB } from "@packages"
import app from "./app.js"


const startServer = async()=>{
    try {
        await connectDB( process.env.MONGODB_URI as string, process.env.MONGODB_DB_NAME as string);     
        app.listen(process.env.PORT,()=>{
            console.log(` Notifications service running on port ${process.env.PORT}`);
        })  
       
    } catch (error) {
        console.error("Failed to connect to MongoDB", error);
        process.exit(1); 
}
}

 await startServer()