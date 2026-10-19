import { model, Schema } from "mongoose"

export interface Notification {
    sender_id: string
    receiver_id: string
    post_id: string
    text: string
    time: string
    read: boolean
}

const notificationSchema = new Schema<Notification>({
    sender_id: {
        type: String,
        required: true
    },
    receiver_id: {
        type: String,
        required: true
    },
    post_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})

export const NotificationModel = model<Notification>("Notification", notificationSchema)
