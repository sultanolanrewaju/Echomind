import { Server, Socket } from "socket.io";
import { parseCookie } from "cookie";
import { Server as HttpServer } from "http";
import config from "../config/app.config.js";
import extractCookie from "../function/extract-cookie.js";
import { UserModel } from "../models/user.model.js";
import { ChunkPayload } from "../types/index.js";
import uploadFile from "../function/upload-file.js";
import publishPost from "../function/publish-post.js";
import fetchPost from "../function/fetch-post.js";
import getUserProfile from "../function/get-user-profile.js";
import { Comment } from "../models/post.model.js";
import createComment from "../function/create-comment.js";
import toggleLike from "../function/like-unlike.js";
import getNotification from "../function/get-notification.js";
import updateNoti from "../function/update-noti.js";
import deleteNoti from "../function/delete-noti.js";
import onlineManager from "./online-manager.js";
import secretMatchmaking from "./matchmaking.js";
import { generateEmotionalReply } from "../services/ai.service.js";

let io: Server | null = null;

const initializeSocket = (httpServer: HttpServer): Server => {
    if (io) return io;

    // const allowedOrigins = Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN : [config.CORS_ORIGIN];
    const allowedOrigins = [
        "http://localhost:5000",       // Vite dev server
        "https://localhost",           // Capacitor Android app
        "capacitor://localhost",       // Capacitor iOS (optional)
        config.CORS_ORIGIN,        // your deployed web frontend, if any
    ].filter(Boolean) as string[];

    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (
                    !origin ||
                    allowedOrigins.includes("*") ||
                    allowedOrigins.includes(origin) ||
                    (config.NODE_ENV === "development" && (origin.startsWith("http://localhost:") || origin.startsWith("http://127.0.0.1:")))
                ) {
                    callback(null, true);
                } else {
                    callback(new Error(`\n[!] Socket.IO CORS blocked origin : ${origin}`));
                }
            },
            methods: ["GET", "POST"],
            credentials: true,
        },
        pingTimeout: 20000,
        pingInterval: 25000,
        maxHttpBufferSize: 1e8, // 100 MB
        transports: ["websocket", "polling"],
        allowEIO3: false,
    });

    // Flexible Authentication Middleware supporting tokens via auth payload, headers, or cookies
    io.use(async (socket: Socket, next) => {
        try {
            const rawCookie = socket.handshake.headers.cookie;
            const cookies = parseCookie((rawCookie as string) || "");

            const authToken =
                socket.handshake.auth?.token ||
                (socket.handshake.headers["authcookie"] as string) ||
                (socket.handshake.headers["authCookie"] as string) ||
                cookies.echomind_user ||
                null;

            const fallbackUserID = socket.handshake.auth?.userID;

            if (authToken) {
                const parsedCookie = extractCookie(authToken as string);
                if (parsedCookie) {
                    socket.data.userID = parsedCookie.userID;
                    socket.data.raw_device_token = parsedCookie.raw_device_token;
                    return next();
                }
            }

            if (fallbackUserID) {
                const existingUser = await UserModel.findOne({ user_id: fallbackUserID });
                if (existingUser) {
                    socket.data.userID = fallbackUserID;
                    return next();
                }
            }

            return next(new Error("Unauthorized : Invalid session or token"));
        } catch (err) {
            return next(new Error("Unauthorized : Authentication failed"));
        }
    });

    io.on("connection", async (socket: Socket) => {
        const userID = socket.data.userID;

        // Fetch user from database
        const user = await UserModel.findOne({ user_id: userID });

        // Register socket in OnlineManager
        const { isFirstConnection } = onlineManager.addUserSocket(
            userID,
            socket,
            user?.user_feeling || "Normal",
            user?.user_country || "Global"
        );

        if (isFirstConnection) {
            await onlineManager.markUserStatusInDB(userID, true);
        }

        console.log(`\n[+] Socket Connected : ${userID} (Socket: ${socket.id}) | Online Users: ${onlineManager.getOnlineCount()}`);

        // Send connection acknowledgment and initial state
        socket.emit("connection_ack", user);
        socket.emit("online:stats", {
            onlineCount: onlineManager.getOnlineCount(),
            timestamp: new Date().toISOString(),
        });

        // Broadcast updated online stats to everyone
        onlineManager.broadcastOnlineStats(io!);

        await getUserProfile(userID);
        await getNotification(userID);

        // Uploading Post Media File Chunks
        socket.on("file-upload:chunk", async (data: ChunkPayload, ack) => {
            await uploadFile(data, ack);
        });

        // Publish New Post
        socket.on("publish-post", async (post) => {
            await publishPost(post, socket.data.userID);
        });

        // Fetch all posts with pagination
        socket.on("fetch-post", async (data, callback) => {
            await fetchPost(data?.limit || 5, data?.skip || 0, callback);
        });

        // Handle Like/Unlike
        socket.on("handle-like", async (postID: string) => {
            await toggleLike(postID, socket.data.userID);
        });

        // Create new comment
        socket.on("create-comment", async (postID: string, comment: Comment) => {
            await createComment(postID, comment);
        });

        // Notifications
        socket.on("read-notification", updateNoti);
        socket.on("delete-notification", deleteNoti);

        // --- EMOTIONAL AI CHAT HANDLER ---
        socket.on("ai:message", async (data: { message: string; history?: { sender: "user" | "bot"; text: string }[] }, callback) => {
            try {
                const userMessage = data?.message || "";
                if (!userMessage.trim()) return;

                const reply = await generateEmotionalReply(userMessage, data?.history || []);
                const responsePayload = {
                    text: reply,
                    timestamp: new Date().toISOString(),
                };

                socket.emit("ai:reply", responsePayload);

                if (typeof callback === "function") {
                    callback(responsePayload);
                }
            } catch (err) {
                console.error("Error in ai:message socket event:", err);
                socket.emit("ai:reply", {
                    text: "I am right here with you. Take a gentle breath. 🌿 Would you like to connect with a peer supporter?",
                    timestamp: new Date().toISOString(),
                });
            }
        });

        // --- SECRET ANONYMOUS CHAT & MATCHMAKING ---
        socket.on("secret:find-match", (data?: { feeling?: string }) => {
            const feeling = data?.feeling || user?.user_feeling || "Normal";
            secretMatchmaking.requestMatch(socket, io!, feeling);
        });

        socket.on("secret:cancel-match", () => {
            secretMatchmaking.cancelMatch(socket);
        });

        socket.on("secret:send-message", (data: { roomID: string; text: string }) => {
            secretMatchmaking.sendMessage(socket, io!, data);
        });

        socket.on("secret:typing", (data: { roomID: string; isTyping: boolean }) => {
            secretMatchmaking.handleTyping(socket, data);
        });

        socket.on("secret:leave-chat", () => {
            secretMatchmaking.leaveSecretChat(socket, io!);
        });

        // Request current online statistics
        socket.on("get-online-stats", () => {
            socket.emit("online:stats", {
                onlineCount: onlineManager.getOnlineCount(),
                timestamp: new Date().toISOString(),
            });
        });

        // Update feeling state
        socket.on("update-feeling", async (feeling: string) => {
            onlineManager.setUserFeeling(userID, feeling);
            await UserModel.updateOne({ user_id: userID }, { $set: { user_feeling: feeling } });
        });

        // Handle Disconnect & Cleanup
        socket.on("disconnect", async (reason) => {
            secretMatchmaking.handleDisconnect(socket, io!);

            const { isLastConnection } = onlineManager.removeUserSocket(socket.id);
            if (isLastConnection) {
                await onlineManager.markUserStatusInDB(userID, false);
                console.log(`\n[-] User Completely Offline : ${userID} | Remaining Online: ${onlineManager.getOnlineCount()}`);
            } else {
                console.log(`\n[-] Tab Disconnected for ${userID} (Remaining tabs active)`);
            }

            if (io) {
                onlineManager.broadcastOnlineStats(io);
            }
        });

        socket.on("error", (err) => {
            console.error(`\n[!] Socket Error on ${userID}:`, err);
        });
    });

    console.log("\n[+] Socket IO Started Successfully");
    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("\n[!] Socket.IO has not been initialized. Call initializeSocket(httpServer) first.\n");
    }
    return io;
};

export const getSocketById = (userID: string): Socket | undefined => {
    if (!io) return undefined;
    const socketIds = onlineManager.getUserSockets(userID);
    if (socketIds.length > 0) {
        return io.sockets.sockets.get(socketIds[0]);
    }
    return undefined;
};

export default initializeSocket;