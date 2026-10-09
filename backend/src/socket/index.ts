import { Server, Socket } from 'socket.io';
import { parseCookie } from "cookie"
import { Server as HttpServer } from 'http';
import config from '../config/app.config.js';

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
        const userID = cookies.echomind_user

        if (!userID) {
            return next(new Error("Unauthorized: Missing userID"));
        }
        socket.data.userID = userID;
        next();
    });

    io.on('connection', (socket: Socket) => {
        // Store Connection
        const userID = socket.data.userID
        connections.set(userID, socket);
        console.log(`\n[+] Socket Connected : ${userID} | Total Active : ${connections.size}`);

        // Send When Coonected User
        let conn = { userID, timestamp: new Date().toISOString() }
        getSocketById(userID)?.emit("connection_ack", conn)

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