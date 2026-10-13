import postModel from "../models/post.model.js"
import { UserModel } from "../models/user.model.js"
import { getSocketById } from "../socket/index.js"

const getUserProfile = async (userID: string): Promise<void> => {
    try {
        const [totalPost, user] = await Promise.all([
            postModel.countDocuments(),
            UserModel.findOne({ user_id: userID })
        ]);
        const socket = getSocketById(userID)
        socket?.emit("user-profile-info", {
            totalPost,
            followers: user?.user_followers?.length,
            // Reactions will be applied here
            reactions: 0
        })
    } catch (error) {
        console.log("Error while fetching user profie : ", error)
    }
}

export default getUserProfile