import { NotificationModel } from "../models/notification.model.js"
import { getSocketById } from "../socket/index.js"



const getNotification = async (userID: string): Promise<void> => {
    try {
        const option = {
            receiver_id: userID,
        }
        const notification = await NotificationModel.find(option).sort({ createdAt: -1 }).exec()
        // Send all notifications
        const socket = getSocketById(userID)
        if (socket) {
            socket.emit("all-notifications", notification)
        }
    } catch (error) {
        console.log("Error while getting notifications : ", error)
    }
}

export default getNotification