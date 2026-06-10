import  {asyncHandler} from "../../config/asynchandler.js";
import { createClient } from "redis";


const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
}


const pub = createClient({
    url: `redis://${connection.host}:${connection.port}`
});

const sub = createClient({
    url: `redis://${connection.host}:${connection.port}`
});

Promise.all([pub.connect(), sub.connect()]).then(() => {
    console.log("Connected to Redis");
})
.catch((err: any) => {
    console.error("Error connecting to Redis:", err);
});


sub.subscribe("hotelRegistrationsData", (message: any) => {
    console.log("Received message on hotelRegistrationsData channel:", message);   
});

const getNewRegistration = asyncHandler(async (req: any, res: any) => {
   
})

export default {
    getNewRegistration
}