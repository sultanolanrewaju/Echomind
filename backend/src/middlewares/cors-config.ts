import config from "../config/app.config.js";
import type { CorsOptions } from "cors";

//const allowedOrigins = Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN : [config.CORS_ORIGIN];
export const allowedOrigins = [
    "http://localhost:5000",       // Vite dev server
    "https://localhost",           // Capacitor Android app
    "capacitor://localhost",       // Capacitor iOS (optional)
    config.CORS_ORIGIN,        // your deployed web frontend, if any
].filter(Boolean) as string[];

const corsOption: CorsOptions = {
    origin: (origin, callback) => {
        if (
            !origin ||
            allowedOrigins.includes("*") ||
            allowedOrigins.includes(origin) ||
            (config.NODE_ENV === "development" && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
        ) {
            callback(null, true);
        } else {
            callback(new Error(`[!] CORS policy blocked access from origin : ${origin}`));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization", "authcookie", "authCookie", "Cookie"],
};

export default corsOption;