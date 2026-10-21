import { io, Socket } from "socket.io-client";
import { url } from "../libs/axios-api";

export const socket: Socket = io(url, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
});

export const connectSocket = (): void => {
    const token = localStorage.getItem("echomind-token");
    let userID: string | undefined = undefined;
    try {
        const userStr = localStorage.getItem("echomind-user");
        if (userStr) {
            const parsed = JSON.parse(userStr);
            userID = parsed?.user_id;
        }
    } catch {
        userID = undefined;
    }

    socket.auth = {
        token: token || undefined,
        userID,
    };

    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = (): void => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;