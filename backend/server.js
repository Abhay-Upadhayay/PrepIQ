import app from "./src/app.js";
import connectDB from "./src/db/connectDb.js";
import config from "./src/config/config.js";

connectDB()
    .then(() => {
        app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    });