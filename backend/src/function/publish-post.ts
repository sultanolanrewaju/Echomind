import postModel, { Post } from "../models/post.model.js";
import { getIO, getSocketById } from "../socket/index.js";
import { RequestPost } from "../types/index.js";
import getUserProfile from "./get-user-profile.js";

const publishPost = async (post: Post & RequestPost, posterID: string): Promise<void> => {
    try {
        const newPost = new postModel({
            ...post,
            poster_id: posterID,
            likes: [],
            comments: [],
            shares: [],
        });
        await newPost.save();

        const [totalPost, latestPost] = await Promise.all([
            postModel.countDocuments(),
            postModel.findById(newPost._id).lean(),
        ]);

        const io = getIO();
        const socket = getSocketById(posterID);
        socket?.emit("post-publish:success", { post: latestPost, totalPost });

        // Broadcast new post to all online users in real-time
        io.emit("new-post", latestPost);

        await getUserProfile(posterID);
    } catch (error) {
        console.error("Error while publishing post:", error);
    }
};

export default publishPost;