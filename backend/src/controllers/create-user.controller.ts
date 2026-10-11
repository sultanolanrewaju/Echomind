import { Request, Response } from "express";
import crypto from 'crypto';
import geoip from 'geoip-lite';
import config from "../config/app.config.js";
import genUserID from "../function/gen-id.js";
import { parseCookie } from "cookie";
import { UserModel, type User } from "../models/user.model.js";
import extractCookie from "../function/extract-cookie.js";
import getUser from "../function/get-user.js";


const createUser = async (_req: Request, res: Response): Promise<void> => {
    try {
        const cookies = parseCookie(_req?.headers?.cookie as string || "");
        let cookie = cookies?.echomind_user || null
        let userID = genUserID()
        let rawDeviceToken = crypto.randomBytes(32).toString('hex');
        let user: User | null = null;

        if (cookie) {
            let isCookie = extractCookie(cookie as string)
            if (!isCookie) {
                res.status(403).json({
                    success: false,
                    message: "Invalid user cookie",
                    timestamp: new Date().toISOString()
                });
                return
            }
            userID = isCookie?.userID
            rawDeviceToken = isCookie?.raw_device_token
            user = await getUser(userID)

            res.cookie("echomind_user", cookie, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 360 * 24 * 60 * 60 * 1000,
                path: "/",
            });
        } else {
            const userAgent = _req.headers['user-agent'] || _req.get('user-agent') || 'Unknown';
            const ip = _req.ip || _req.headers['x-forwarded-for'] || _req.socket.remoteAddress;
            const geo = geoip.lookup(ip as string);
            const country = geo ? geo.country : 'Unknown (Local/Private IP)';
            const deviceTokenHash = crypto.createHash('sha256').update(rawDeviceToken).digest('hex');
            cookie = `${userID}--${rawDeviceToken}`

            user = {
                user_id: userID as string,
                user_device_token: deviceTokenHash as string,
                user_ip: ip as string,
                user_agent: userAgent as string,
                user_country: country as string,
                user_followers: [],
                user_feeling: "Normal",
                active_status: true
            }
            const newUser = new UserModel(user)
            await newUser.save()

            res.cookie("echomind_user", cookie, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 360 * 24 * 60 * 60 * 1000,
                path: "/",
            });
        }

        res.status(200).json({
            success: true,
            message: "New User Created Successfully",
            token: cookie,
            userID, user: user,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log("Error while creating user : ", error)
        res.status(505).json({
            success: false,
            message: "Internal server error",
            timestamp: new Date().toISOString()
        });
    }
}

export default createUser