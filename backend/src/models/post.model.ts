import { model, Schema } from "mongoose";

export type Comment = {
    commenter_id: string
    comment: string
    time: string
}
export interface Post {
    poster_id: string,
    post_content: string
    post_feeling: string
    post_media: string
    likes: string[]
    comments: Comment[]
    shares: string[]
}

const postSchema = new Schema<Post>({
    poster_id: {
        type: String,
        required: true
    },
    post_content: {
        type: String,
        default: ""
    },
    post_feeling: {
        type: String,
        default: ""
    },
    post_media: {
        type: String,
        default: ""
    },
    likes: {
        type: [{ type: String }]
    },
    comments: [
        {
            commenter_id: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            time: {
                type: String,
                default: Date.now
            }
        }
    ],
    shares: [{ type: String }]
}, { timestamps: true });

postSchema.index({ createdAt: -1 });

const postModel = model<Post>("Post", postSchema);

export default postModel