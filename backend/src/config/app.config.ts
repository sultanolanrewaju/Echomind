import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "development";
loadEnv({ path: path.resolve(__dirname, `../../.env.${env}`), quiet: true });
loadEnv({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const rawCors = process.env.CORS_ORIGIN || "http://localhost:5000,http://localhost:5173,https://echo-mind-app.onrender.com,https://echo-mind-ghs.netlify.app";
const corsOrigins = rawCors.split(",").map((o) => o.trim()).filter(Boolean);

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    CORS_ORIGIN: corsOrigins,
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/echo-mind",
    JWT_SECRET: process.env.JWT_SECRET || "___ghs__julian___",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || ""
}

export default config;