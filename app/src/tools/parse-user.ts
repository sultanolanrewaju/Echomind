import type { User } from "../store/useAPI";

const parsedUser = (user: User): User => {
    return {
        user_id: user.user_id,
        user_device_token: user.user_device_token,
        user_ip: user.user_ip,
        user_agent: user.user_agent,
        user_country: user.user_country,
        user_followers: user.user_followers,
        user_feeling: user.user_feeling,
        active_status: user.active_status
    }
}

export default parsedUser