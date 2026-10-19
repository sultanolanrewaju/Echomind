import { NotificationModel } from "../models/notification.model.js"


const updateNoti = async (notiID: string): Promise<void> => {
    try {
        const noti = await NotificationModel.findById(notiID)
        if (!noti) return

        noti.read = true
        await noti.save()
    } catch (error) {
        console.log("Error while updating noti : ", error)
    }
}

export default updateNoti