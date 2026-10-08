import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const env = process.env.NODE_ENV || "development";
loadEnv({ path: path.resolve(__dirname, `../../.env.${env}`), quiet: true });

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 3000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5000",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/echo-mind",
}

export default config