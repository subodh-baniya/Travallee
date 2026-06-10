import { asyncHandler } from "../../config/asynchandler.js";
import { createClient } from "redis";
import { io } from "../../app.js";


const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
}


const pub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

const sub = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

Promise.all([pub.connect(), sub.connect()]).then(() => {
    console.log("Connected to Redis");

    sub.subscribe("hotelRegistrationsData", async (message: string) => {
        try {
            const data = JSON.parse(message);
            console.log("Received hotel registration data:", data);
            io.to(`superadmin`).emit("hotelRegistrationsData", data);
            console.log("Received message on hotelRegistrationsData channel:", message);
        }
        catch (err: any) {
            console.error("Error parsing hotel registration data message:", err);
        }
    })
})
    .catch((err: any) => {
        console.error("Error connecting to Redis:", err);
    });


const getNewRegistration = asyncHandler(async (req: any, res: any) => {

})

export default {
    getNewRegistration
}