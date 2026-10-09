import { NextFunction, Request, Response } from "express";
import config from "../config/app.config.js";

const globalErrorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("\n[!] Unhandled Error : ", err.stack || err.message);
    res.status(500).json({
        success: false,
        message: config.NODE_ENV === "production" ? "Internal Server Error" : err.message,
    });
}

export default globalErrorHandler