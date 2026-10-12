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
import userRoute from "./routes/user.routes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer(app);

// Hide Express header
app.disable("x-powered-by");
app.set('trust proxy', true);

// Set CORS Origin
app.use(cors(corsOption));

// Set JSON Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
const uploadDir = path.join(__dirname, "../uploads/")
app.use('/uploads', express.static(uploadDir));

// Index Route Endpoint
app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
        status: true,
        success: true,
        message: "Express Server Started Successfully",
        timestamp: new Date().toISOString()
    });
});

// Health Check Endpoint
app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Defined API Endpoints
app.use("/api", userRoute)

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