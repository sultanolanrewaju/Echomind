import { Request, Response } from "express";
import postModel from "../models/post.model.js";

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 10, 1), 50);
        const skip = Math.max(parseInt(req.query.skip as string) || 0, 0);

        const [totalPost, posts] = await Promise.all([
            postModel.countDocuments(),
            postModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
        ]);

        res.status(200).json({
            success: true,
            posts,
            latestPost: posts,
            totalPost,
            hasMore: skip + posts.length < totalPost,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error fetching posts via HTTP:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch posts",
            posts: [],
            latestPost: [],
            totalPost: 0,
        });
    }
};

export default {
    getPosts,
};
