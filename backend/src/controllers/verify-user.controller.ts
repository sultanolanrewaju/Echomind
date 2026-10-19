import { Request, Response } from "express";
import config from "../config/app.config.js";
import { User, UserModel } from "../models/user.model.js";

const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const cookie =
            (req as Request & { cookie?: string }).cookie ||
            (req.headers["authcookie"] as string) ||
            (req.headers["authCookie"] as string) ||
            null;

        const currentUser = (req as Request & { user?: User | undefined }).user;

        if (!currentUser?.user_id) {
            res.status(404).json({
                success: false,
                message: "User ID Not Found",
                timestamp: new Date().toISOString(),
            });
            return;
        }

        // Keep active status updated
        await UserModel.updateOne({ user_id: currentUser.user_id }, { $set: { active_status: true } });

        const isProd = config.NODE_ENV === "production";
        if (cookie) {
            res.cookie("echomind_user", cookie, {
                httpOnly: true,
                secure: isProd,
                sameSite: isProd ? "none" : "lax",
                path: "/",
                maxAge: 365 * 24 * 60 * 60 * 1000,
            });
        }

        res.status(200).json({
            success: true,
            user: currentUser,
            message: "User Verified Successfully",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error in verifyUser controller:", error);
        res.status(500).json({
            success: false,
            message: "User Verification Failed",
            timestamp: new Date().toISOString(),
        });
    }
};

export default verifyUser;