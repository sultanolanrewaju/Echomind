import { Notification, NotificationModel } from "../models/notification.model.js"
import postModel from "../models/post.model.js"
import { getSocketById } from "../socket/index.js"


const toggleLike = async (postID: string, userID: string): Promise<void> => {
    try {
        const post = await postModel.findById(postID)
        if (!post) return

        const likes = post?.likes || []
        if (likes?.includes(userID)) {
            // Handle Unlike
            const updatedLikes = likes?.filter((id) => id !== userID)
            post.likes = updatedLikes
            await post.save()
        } else {
            // Handle Like
            post?.likes?.push(userID)
            await post.save()
            const notification: Notification = {
                sender_id: userID,
                receiver_id: post?.poster_id,
                post_id: post?._id?.toString(),
                text: `${userID} reacted to your post`,
                time: Date(),
                read: false
            }
            await NotificationModel.create(notification)
            /* ---IF THE USER IS ONLINE--- */
            const socket = getSocketById(post?.poster_id)
            if (socket) {
                socket.emit("new-notification", notification)
            }
        }
    } catch (error) {
        console.log("Error while like/unlike : ", error)
    }
}

export default toggleLike