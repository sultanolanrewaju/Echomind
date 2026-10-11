import { parseCookie } from "cookie";
import { NextFunction, Request, Response } from "express";
import extractCookie from "../function/extract-cookie.js";
import { UserModel, User } from "../models/user.model.js";
import crypto from "crypto"




const isCookie = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const cookies = parseCookie(req?.headers?.cookie as string || "");
        let cookie = cookies?.echomind_user || null

        if (!cookie) {
            res.status(403).json({
                success: false,
                message: "User cookie not found"
            })
            return
        }
        const extractedCookie = extractCookie(cookie as string)
        if (!extractedCookie) {
            res.status(403).json({
                success: false,
                message: "Unauthorized access, invalid cookie"
            })
            return
        }

        const user = await UserModel.findOne({ user_id: extractedCookie?.userID });
        if (!user) {
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid User ID' });
            return;
        }
        const incomingTokenHash = crypto.createHash('sha256').update(extractedCookie?.raw_device_token).digest('hex');

        if (incomingTokenHash !== user.user_device_token) {
            res.status(403).json({ success: false, message: 'Forbidden : Device token mismatch!' });
            return;
        }
        const request = req as Request & { cookie?: string; user: User };
        request.cookie = cookie;
        request.user = user;
        next();
    } catch (error) {
        res.status(505).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export default isCookie