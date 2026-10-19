
export interface Cookie {
    userID: string
    raw_device_token: string
}
const extractCookie = (cookie: string) => {
    const parsedCookie = cookie.split("--")
    if (parsedCookie?.length == 2) {
        return {
            userID: parsedCookie[0],
            raw_device_token: parsedCookie[1]
        }
    } else {
        return false
    }
}

export default extractCookie