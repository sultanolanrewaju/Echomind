
type Follower = {
    user_id: string
}

interface User {
    user_id: string
    user_ip: string
    user_agent: string
    user_country: string
    user_followers: Follower[]
    user_feeling: string
    active_status: boolean
}