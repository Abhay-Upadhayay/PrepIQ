import dotenv from "dotenv";

dotenv.config();

const _config = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    openaiApiKey: process.env.OPENAI_API_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
};

const config = Object.freeze(_config);

export default config;