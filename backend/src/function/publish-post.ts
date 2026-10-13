import postModel, { Post } from "../models/post.model.js"
import { getSocketById } from "../socket/index.js"
import { RequestPost } from "../types/index.js"
import getUserProfile from "./get-user-profile.js"

const publishPost = async (post: Post & RequestPost, posterID: string): Promise<void> => {
    try {
        const newPost = new postModel(post)
        newPost.poster_id = posterID
        await newPost.save()
        const [totalPost, latestPost] = await Promise.all([postModel.countDocuments(), postModel.findById(newPost?._id)])
        const socket = getSocketById(posterID)
        socket?.emit("post-publish:success", { post: latestPost, totalPost })
        await getUserProfile(posterID)
    } catch (error) {
        console.log("Error while publishing post : ", error)
    }
}

export default publishPost