import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import config from "./config/app.config.js";
import globalErrorHandler from "./middlewares/global-error-handler.js";
import notFoundError from "./middlewares/404-error-handler.js";
import corsOption from "./middlewares/cors-config.js";
import printBanner from "./function/strart-banner.js";
import connectDB from "./config/db.config.js";
import initializeSocket from "./socket/index.js";
import genUserID from "./function/gen-id.js";

const app = express();
const server = createServer(app);

// Hide Express header
app.disable("x-powered-by");

// Set CORS Origin
app.use(cors(corsOption));

// Set JSON Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Index Route Endpoint
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: true,
        success: true,
        message: "Express Server Started Successfully",
        timestamp: new Date().toISOString()
    });
});

// Create User Route Endpoint
app.post("/api/gen-user", (_req: Request, res: Response) => {
    res.cookie("echomind_user", genUserID(), {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    res.status(200).json({
        success: true,
        message: "New User Created Successfully",
        timestamp: new Date().toISOString()
    });
});

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global 404 Handler
app.use(notFoundError);

// Global Error Handler
app.use(globalErrorHandler);

// Server Listener & Graceful Shutdown
const start = async (): Promise<void> => {
    try {
        await connectDB()
        initializeSocket(server)
        server.listen(config.PORT, printBanner);
        const shutdown = (signal: string): void => {
            console.log(`\n[*] ${signal} signal received. Shutting down gracefully...`);
        };
        process.on("SIGINT", () => shutdown("SIGINT"));
        process.on("SIGTERM", () => shutdown("SIGTERM"));
    } catch (error) {
        console.error("[!] Server could not be started:", error);
        process.exit(1);
    }
}

void start();
export default app;