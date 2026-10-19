import { Request, Response } from "express";
import crypto from "crypto";
import geoip from "geoip-lite";
import config from "../config/app.config.js";
import genUserID from "../function/gen-id.js";
import { parseCookie } from "cookie";
import { UserModel, type User } from "../models/user.model.js";
import extractCookie from "../function/extract-cookie.js";
import getUser from "../function/get-user.js";

const createUser = async (_req: Request, res: Response): Promise<void> => {
    try {
        const rawCookieHeader = (_req?.headers?.cookie as string) || "";
        const cookies = parseCookie(rawCookieHeader);
        const headerToken = (_req?.headers?.authcookie as string) || (_req?.headers?.authCookie as string) || null;
        let incomingToken = headerToken || cookies?.echomind_user || _req.body?.token || null;

        const isProd = config.NODE_ENV === "production";
        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? ("none" as const) : ("lax" as const),
            path: "/",
            maxAge: 365 * 24 * 60 * 60 * 1000,
        };

        const rawIp = (_req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || _req.ip || _req.socket.remoteAddress || "127.0.0.1";
        let country = "Global (Anonymous)";
        try {
            const geo = geoip.lookup(rawIp);
            if (geo?.country) country = geo.country;
        } catch {
            country = "Global (Anonymous)";
        }
        const userAgent = _req.headers["user-agent"] || "Unknown";

        let userID = genUserID();
        let rawDeviceToken = crypto.randomBytes(32).toString("hex");
        let user: User | null = null;
        let finalToken = "";

        if (incomingToken) {
            const parsed = extractCookie(incomingToken);
            if (parsed) {
                userID = parsed.userID;
                rawDeviceToken = parsed.raw_device_token;
                user = await getUser(userID);

                // If user doesn't exist in DB anymore, recreate them with existing ID
                if (!user) {
                    const deviceTokenHash = crypto.createHash("sha256").update(rawDeviceToken).digest("hex");
                    user = {
                        user_id: userID,
                        user_device_token: deviceTokenHash,
                        user_ip: rawIp,
                        user_agent: userAgent,
                        user_country: country,
                        user_followers: [],
                        user_feeling: "Normal",
                        active_status: true,
                    };
                    const newUser = new UserModel(user);
                    await newUser.save();
                }
                finalToken = incomingToken;
            }
        }

        if (!user) {
            const deviceTokenHash = crypto.createHash("sha256").update(rawDeviceToken).digest("hex");
            finalToken = `${userID}--${rawDeviceToken}`;
            user = {
                user_id: userID,
                user_device_token: deviceTokenHash,
                user_ip: rawIp,
                user_agent: userAgent,
                user_country: country,
                user_followers: [],
                user_feeling: "Normal",
                active_status: true,
            };
            const newUser = new UserModel(user);
            await newUser.save();
        }

        res.cookie("echomind_user", finalToken, cookieOptions);

        res.status(200).json({
            success: true,
            message: "User session initialized successfully",
            token: finalToken,
            userID: user.user_id,
            user,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error while creating user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            timestamp: new Date().toISOString(),
        });
    }
};

export default createUser;