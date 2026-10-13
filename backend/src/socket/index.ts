import { Server, Socket } from 'socket.io';
import { parseCookie } from "cookie"
import { Server as HttpServer } from 'http';
import config from '../config/app.config.js';
import extractCookie, { Cookie } from '../function/extract-cookie.js';
import { UserModel } from '../models/user.model.js';
import { ChunkPayload, RequestPost } from '../types/index.js';
import uploadFile from "../function/upload-file.js"
import publishPost from '../function/publish-post.js';
import fetchPost from '../function/fetch-post.js';
import getUserProfile from '../function/get-user-profile.js';
import { Comment } from '../models/post.model.js';
import createComment from '../function/create-comment.js';
import toggleLike from '../function/like-unlike.js';

let io: Server | null = null;
const connections = new Map<string, Socket>();

const initializeSocket = (httpServer: HttpServer): Server => {
    if (io) return io;

    const allowedOrigins = Array.isArray(config.CORS_ORIGIN) ? config.CORS_ORIGIN : [config.CORS_ORIGIN];
    io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
                    callback(null, true);
                } else {
                    callback(new Error(`\n[!] Socket.IO CORS blocked origin :  ${origin}`));
                }
            },
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 20000,
        pingInterval: 25000,
        maxHttpBufferSize: 1e8, // 100 MB
        transports: ['websocket', 'polling'],
        allowEIO3: false,
    });

    // Authentication Middleware
    io.use((socket: Socket, next) => {
        const reqCookie = socket.handshake.headers.cookie;
        const cookies = parseCookie(reqCookie as string);
        const cookie = cookies.echomind_user
        const parsedCookie = extractCookie(cookie as string)

        if (!parsedCookie) {
            return next(new Error("Unauthorized : user cookie is invalid"));
        }

        socket.data.userID = parsedCookie.userID;
        socket.data.raw_device_token = parsedCookie.raw_device_token;
        next();
    });

    io.on('connection', async (socket: Socket) => {
        // Store Connection
        const userID = socket.data.userID
        connections.set(userID, socket);
        console.log(`\n[+] Socket Connected : ${userID} | Total Active : ${connections.size}`);

        // Send When Coonected User
        const user = await UserModel.findOne({ user_id: userID })
        getSocketById(userID)?.emit("connection_ack", user)
        await getUserProfile(userID)


        // Uploading Post Files
        socket.on('file-upload:chunk', async (data: ChunkPayload, ack) => {
            await uploadFile(data, ack);
        });
        // Publish New Post
        socket.on("publish-post", async (post) => {
            await publishPost(post, userID)
        })
        // Fetch all post
        socket.on("fetch-post", async (data, callback) => {
            await fetchPost(data?.limit || 5, data?.skip || 0, callback)
        })
        // Handle Like/Unlike 
        socket.on("handle-like", async (postID: string) => {
            await toggleLike(postID, userID)
        })
        // Create new comment
        socket.on("create-comment", async (postID: string, comment: Comment) => {
            await createComment(postID, comment)
        })

        // Handle Disconnect & Cleanup Socket Server
        socket.on('disconnect', (reason) => {
            connections.delete(userID);
            console.log(`\n[-] User Disconnected :  ${userID}`);
        });

        // Handle Socket Errors
        socket.on('error', (err) => {
            console.error(`\n[!] Socket Error on ${userID} : `, err);
        });
    });

    console.log("\n[+] Socket IO Started Successfully")
    return io;
};

// Return instance or throw error if uninitialized
export const getIO = (): Server => {
    if (!io) {
        throw new Error('\n[!] Socket.IO has not been initialized. Call initializeSocket(httpServer) first.\n');
    }
    return io;
};

// Returns Map without throwing when empty connections
export const getConnections = (): Map<string, Socket> => {
    return connections;
};

// Get a specific socket by socket ID
export const getSocketById = (socketId: string): Socket | undefined => {
    return connections.get(socketId);
};

export default initializeSocket;