import { Schema, model } from "mongoose"

type Follower = {
    user_id: string
}

export interface User {
    user_id: string | null
    user_device_token: string
    user_ip: string
    user_agent: string
    user_country: string
    user_followers: Follower[]
    user_feeling: string
    active_status: boolean
}

const userSchema = new Schema<User>({
    user_id: { type: String, required: true },
    user_device_token: { type: String, required: true },
    user_ip: { type: String, required: true },
    user_agent: { type: String, required: true },
    user_country: { type: String, required: true },
    user_followers: [{
        user_id: { type: String, required: true }
    }],
    user_feeling: { type: String, default: "Normal" },
    active_status: { type: Boolean, default: true }
}, {
    timestamps: true
})

export const UserModel = model<User>("User", userSchema)

