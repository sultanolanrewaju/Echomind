import postModel, { Comment } from "../models/post.model.js";

const createComment = async (postID: string, comment: Comment): Promise<void> => {
    try {
        const post = await postModel.findById(postID)
        if (!post) return

        post.comments.push(comment)
        await post.save()
    } catch (error) {
        console.log("Error while create comment : ", error)
    }
}

export default createComment