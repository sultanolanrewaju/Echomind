import { io } from "socket.io-client";
import genUserID, { createUser } from "./gen-id";

const SOCKET_URL = "http://localhost:3000";
export let isConnected = false;

// Create a random user ID
await createUser();
let userID = localStorage.getItem("app_user_id");
if (!userID) {
  userID = genUserID();
  localStorage.setItem("app_user_id", userID);
}
export const socket = io(SOCKET_URL, {
  auth: { userID },
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
    isConnected = true;
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    isConnected = false;
  }
};
