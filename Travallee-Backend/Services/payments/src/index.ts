import app from "./app"

try {
   app.listen(process.env.PORT, () => {
            console.log(`Payment service is running on port ${process.env.PORT}`);
    })
} catch (error) {
 console.log(`Error in connection of payment service`,error);   
}