import mongoose from "mongoose";

export const connectDB = async (uri : string, dbName: string) => {
    try {
        const response = await mongoose.connect(`${uri}/${dbName}` as string, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
            retryWrites: false,
        });
        console.log("MongoDB connected successfully", response.connection.host);
        return true;
    }   catch (error: any) {
        if (error instanceof Error) {
            console.error("Error connecting to MongoDB:", error);
        } else {
            console.error("Unexpected error connecting to MongoDB:", error);
        }
        throw error;
    } ;
};