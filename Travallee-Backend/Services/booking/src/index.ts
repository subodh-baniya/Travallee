// @ts-ignore
import {connectDB} from "./config/Func/connect.db.js"

import app from "./app.js"
import { startBookingExpiryCron } from "./config/Func/bookingExpiary.cron.js";

connectDB(process.env.DATABASE_URL as string ,process.env.DATABASE_NAME as string).then(()=>{
    console.log("Database connected successfully");
    app.listen(process.env.PORT,()=>{
            console.log(`server running on port ${process.env.PORT}`)
    })
}).catch(()=>{
    console.log("Error in database connection booking")
})

startBookingExpiryCron();