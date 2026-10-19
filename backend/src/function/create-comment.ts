import { Notification, NotificationModel } from "../models/notification.model.js";
import postModel, { Comment } from "../models/post.model.js";
import { getIO } from "../socket/index.js";
import getNotification from "./get-notification.js";

const createComment = async (postID: string, comment: Comment): Promise<void> => {
    try {
        const post = await postModel.findById(postID);
        if (!post) return;

        post.comments.push(comment);
        await post.save();

        if (comment?.commenter_id !== post.poster_id) {
            const notification: Notification = {
                sender_id: comment.commenter_id,
                receiver_id: post.poster_id,
                post_id: post._id.toString(),
                text: `${comment.commenter_id} commented on your post`,
                time: new Date().toISOString(),
                read: false,
            };
            await NotificationModel.create(notification);
            await getNotification(post.poster_id);
        }

        // Broadcast comment update to all connected users
        const io = getIO();
        io.emit("post-comment-added", {
            postID,
            comment,
            comments: post.comments,
        });
    } catch (error) {
        console.error("Error while creating comment:", error);
    }
};

export default createComment;