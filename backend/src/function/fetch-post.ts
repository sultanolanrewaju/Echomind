import postModel from "../models/post.model.js"

const fetchPost = async (limit: number, skip: number, callback: (result: { latestPost: unknown[]; totalPost: number }) => void): Promise<void> => {
    try {
        // 1. Fetch total count of posts in the database
        const totalPost = await postModel.countDocuments();

        // 2. Fetch the paginated posts sorted by creation date (newest first)
        const latestPost = await postModel.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(); // .lean() is optional for performance, returns plain JS objects

        // 3. Send back the response in the exact structure expected by the frontend
        if (typeof callback === "function") {
            callback({
                latestPost,
                totalPost
            });
        }
    } catch (error) {
        console.error("Error fetching posts via socket:", error);
        if (typeof callback === "function") {
            callback({
                latestPost: [],
                totalPost: 0
            });
        }
    }
}

export default fetchPost