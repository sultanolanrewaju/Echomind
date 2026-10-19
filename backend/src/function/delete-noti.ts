import { NotificationModel } from "../models/notification.model.js"

const deleteNoti = async (notiID: string): Promise<void> => {
    try {
        await NotificationModel.findByIdAndDelete(notiID)
    } catch (error) {
        console.log("Error while deleting notification : ", error)
    }
}

export default deleteNoti