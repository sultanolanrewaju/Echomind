import { Request, Response } from "express";
import config from "../config/app.config.js";
import genUserID from "../function/gen-id.js";
import { parseCookie } from "cookie";


const createUser = (_req: Request, res: Response): void => {
    const cookies = parseCookie(_req.headers.cookie as string);
    let userID = cookies.echomind_user || null

    if (userID) {
        res.cookie("echomind_user", userID, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
    } else {
        userID = genUserID()
        res.cookie("echomind_user", userID, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
    }

    res.status(200).json({
        success: true,
        message: "New User Created Successfully",
        userID,
        timestamp: new Date().toISOString()
    });
}

export default createUser