import { Notification, NotificationModel } from "../models/notification.model.js";
import postModel from "../models/post.model.js";
import { getIO } from "../socket/index.js";
import getNotification from "./get-notification.js";

const toggleLike = async (postID: string, userID: string): Promise<void> => {
    try {
        const post = await postModel.findById(postID);
        if (!post) return;

        const likes = post.likes || [];
        if (likes.includes(userID)) {
            // Handle Unlike
            post.likes = likes.filter((id) => id !== userID);
            await post.save();
        } else {
            // Handle Like
            post.likes.push(userID);
            await post.save();

            if (userID !== post.poster_id) {
                const notification: Notification = {
                    sender_id: userID,
                    receiver_id: post.poster_id,
                    post_id: post._id.toString(),
                    text: `${userID} reacted to your post`,
                    time: new Date().toISOString(),
                    read: false,
                };
                await NotificationModel.create(notification);
                await getNotification(post.poster_id);
            }
        }

        // Broadcast like update to all connected users
        const io = getIO();
        io.emit("post-like-updated", {
            postID,
            likes: post.likes,
        });
    } catch (error) {
        console.error("Error while like/unlike:", error);
    }
};

export default toggleLike;