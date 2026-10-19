import postModel from "../models/post.model.js";

const fetchPost = async (
    limit: number,
    skip: number,
    callback?: (result: { latestPost: unknown[]; posts: unknown[]; totalPost: number; hasMore: boolean }) => void
): Promise<{ latestPost: unknown[]; posts: unknown[]; totalPost: number; hasMore: boolean }> => {
    try {
        const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
        const safeSkip = Math.max(Number(skip) || 0, 0);

        const [totalPost, latestPost] = await Promise.all([
            postModel.countDocuments(),
            postModel.find()
                .sort({ createdAt: -1 })
                .skip(safeSkip)
                .limit(safeLimit)
                .lean(),
        ]);

        const result = {
            latestPost,
            posts: latestPost,
            totalPost,
            hasMore: safeSkip + latestPost.length < totalPost,
        };

        if (typeof callback === "function") {
            callback(result);
        }
        return result;
    } catch (error) {
        console.error("Error fetching posts via socket:", error);
        const fallback = {
            latestPost: [],
            posts: [],
            totalPost: 0,
            hasMore: false,
        };
        if (typeof callback === "function") {
            callback(fallback);
        }
        return fallback;
    }
};

export default fetchPost;