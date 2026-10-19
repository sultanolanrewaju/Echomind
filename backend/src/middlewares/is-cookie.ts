import { parseCookie } from "cookie";
import { NextFunction, Request, Response } from "express";
import extractCookie from "../function/extract-cookie.js";
import { UserModel, User } from "../models/user.model.js";
import crypto from "crypto";

const isCookie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const rawCookies = parseCookie((req?.headers?.cookie as string) || "");
        const authHeader = (req.headers["authorization"] as string) || "";
        const bearerToken = authHeader.replace(/^Bearer\s+/i, "").trim();

        const cookie =
            (req?.headers?.authcookie as string) ||
            (req?.headers?.authCookie as string) ||
            bearerToken ||
            rawCookies.echomind_user ||
            null;

        if (!cookie) {
            res.status(403).json({
                success: false,
                message: "User session token not found",
            });
            return;
        }

        const extractedCookie = extractCookie(cookie as string);
        if (!extractedCookie) {
            res.status(403).json({
                success: false,
                message: "Unauthorized access, invalid token format",
            });
            return;
        }

        const user = await UserModel.findOne({ user_id: extractedCookie.userID });
        if (!user) {
            res.status(401).json({ success: false, message: "Unauthorized: Invalid User ID" });
            return;
        }

        const incomingTokenHash = crypto
            .createHash("sha256")
            .update(extractedCookie.raw_device_token)
            .digest("hex");

        if (incomingTokenHash !== user.user_device_token) {
            res.status(403).json({ success: false, message: "Forbidden: Device token mismatch" });
            return;
        }

        const request = req as Request & { cookie?: string | undefined; user: User };
        request.user = user;
        request.cookie = cookie;
        next();
    } catch (error) {
        console.error("Error in isCookie middleware:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default isCookie;