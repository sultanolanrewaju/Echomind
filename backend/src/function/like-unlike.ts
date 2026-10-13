import postModel from "../models/post.model.js"


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
        }
    } catch (error) {
        console.log("Error while like/unlike : ", error)
    }
}

export default toggleLike