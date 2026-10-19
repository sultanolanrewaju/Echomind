import { Server, Socket } from "socket.io";
import crypto from "crypto";

interface WaitingUser {
    userID: string;
    socketID: string;
    feeling: string;
    joinedAt: number;
}

interface SecretRoom {
    roomID: string;
    userA: { userID: string; socketID: string; alias: string; feeling: string };
    userB: { userID: string; socketID: string; alias: string; feeling: string };
    createdAt: number;
}

class SecretMatchmaking {
    // Users waiting in queue: Map<userID, WaitingUser>
    private queue: Map<string, WaitingUser> = new Map();
    // Active rooms: Map<roomID, SecretRoom>
    private activeRooms: Map<string, SecretRoom> = new Map();
    // Map userID -> roomID
    private userToRoom: Map<string, string> = new Map();

    private generateAnonymousAlias(userID: string): string {
        const hash = crypto.createHash("md5").update(userID).digest("hex").slice(0, 4);
        return `Echo Peer #${hash.toUpperCase()}`;
    }

    public requestMatch(socket: Socket, io: Server, feeling = "Normal"): void {
        const userID = socket.data.userID;
        if (!userID) return;

        // If user already in an active room, end that room first
        if (this.userToRoom.has(userID)) {
            this.leaveSecretChat(socket, io);
        }

        // Remove from waiting queue if already waiting
        this.queue.delete(userID);

        // Try to find a match among waiting users
        let matchedPartner: WaitingUser | null = null;

        for (const [otherID, waitingUser] of this.queue.entries()) {
            if (otherID !== userID) {
                // Verify other user's socket is still connected
                const otherSocket = io.sockets.sockets.get(waitingUser.socketID);
                if (otherSocket && otherSocket.connected) {
                    matchedPartner = waitingUser;
                    this.queue.delete(otherID);
                    break;
                } else {
                    this.queue.delete(otherID);
                }
            }
        }

        if (matchedPartner) {
            // Found a match! Create secret room
            const roomID = `secret_${crypto.randomBytes(8).toString("hex")}`;
            const partnerSocket = io.sockets.sockets.get(matchedPartner.socketID);

            if (!partnerSocket) {
                // Partner disappeared, re-queue current user
                this.queue.set(userID, {
                    userID,
                    socketID: socket.id,
                    feeling,
                    joinedAt: Date.now(),
                });
                socket.emit("secret:waiting", {
                    message: "Searching for a compassionate peer listener...",
                });
                return;
            }

            const aliasA = this.generateAnonymousAlias(userID);
            const aliasB = this.generateAnonymousAlias(matchedPartner.userID);

            const secretRoom: SecretRoom = {
                roomID,
                userA: { userID, socketID: socket.id, alias: aliasA, feeling },
                userB: {
                    userID: matchedPartner.userID,
                    socketID: matchedPartner.socketID,
                    alias: aliasB,
                    feeling: matchedPartner.feeling,
                },
                createdAt: Date.now(),
            };

            this.activeRooms.set(roomID, secretRoom);
            this.userToRoom.set(userID, roomID);
            this.userToRoom.set(matchedPartner.userID, roomID);

            // Join both sockets to Socket.io room
            socket.join(roomID);
            partnerSocket.join(roomID);

            // Notify User A with User B's anonymous profile
            socket.emit("secret:matched", {
                roomID,
                peer: {
                    alias: aliasB,
                    feeling: matchedPartner.feeling || "Peaceful",
                    role: "Anonymous Peer Listener",
                    avatar: "/icons/user.png",
                },
                message: "You are connected! This chat is 100% anonymous & encrypted.",
            });

            // Notify User B with User A's anonymous profile
            partnerSocket.emit("secret:matched", {
                roomID,
                peer: {
                    alias: aliasA,
                    feeling: feeling || "Peaceful",
                    role: "Anonymous Peer Listener",
                    avatar: "/icons/user.png",
                },
                message: "You are connected! This chat is 100% anonymous & encrypted.",
            });

            console.log(`[+] Secret match created: ${aliasA} <-> ${aliasB} (Room: ${roomID})`);
        } else {
            // No match found yet, enqueue user
            this.queue.set(userID, {
                userID,
                socketID: socket.id,
                feeling,
                joinedAt: Date.now(),
            });

            socket.emit("secret:waiting", {
                message: "Searching for a compassionate peer listener...",
                queueSize: this.queue.size,
            });
        }
    }

    public cancelMatch(socket: Socket): void {
        const userID = socket.data.userID;
        if (userID && this.queue.has(userID)) {
            this.queue.delete(userID);
            socket.emit("secret:cancelled", { message: "Match search cancelled." });
        }
    }

    public sendMessage(socket: Socket, io: Server, data: { roomID: string; text: string }): void {
        const userID = socket.data.userID;
        const { roomID, text } = data;
        if (!userID || !roomID || !text || !text.trim()) return;

        const room = this.activeRooms.get(roomID);
        if (!room) {
            socket.emit("secret:error", { message: "Secret chat room does not exist or has expired." });
            return;
        }

        const isUserA = room.userA.userID === userID;
        const isUserB = room.userB.userID === userID;
        if (!isUserA && !isUserB) return;

        const senderAlias = isUserA ? room.userA.alias : room.userB.alias;
        const messagePayload = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            roomID,
            senderID: userID,
            senderAlias,
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            timestamp: Date.now(),
        };

        // Broadcast to both sockets in room
        io.to(roomID).emit("secret:new-message", messagePayload);
    }

    public handleTyping(socket: Socket, data: { roomID: string; isTyping: boolean }): void {
        const { roomID, isTyping } = data;
        if (!roomID) return;
        socket.to(roomID).emit("secret:peer-typing", { isTyping });
    }

    public leaveSecretChat(socket: Socket, io: Server): void {
        const userID = socket.data.userID;
        if (!userID) return;

        const roomID = this.userToRoom.get(userID);
        if (!roomID) return;

        const room = this.activeRooms.get(roomID);
        if (room) {
            // Notify the other peer
            socket.to(roomID).emit("secret:peer-left", {
                message: "Your peer has ended the secret chat session. Take care! 💙",
            });

            this.userToRoom.delete(room.userA.userID);
            this.userToRoom.delete(room.userB.userID);
            this.activeRooms.delete(roomID);

            socket.leave(roomID);
        }
    }

    public handleDisconnect(socket: Socket, io: Server): void {
        const userID = socket.data.userID;
        if (!userID) return;

        // Remove from waiting queue if disconnects
        this.queue.delete(userID);

        // Handle active room if in one
        const roomID = this.userToRoom.get(userID);
        if (roomID) {
            const room = this.activeRooms.get(roomID);
            if (room) {
                socket.to(roomID).emit("secret:peer-disconnected", {
                    message: "Your peer has disconnected from the secret chat.",
                });
                this.userToRoom.delete(room.userA.userID);
                this.userToRoom.delete(room.userB.userID);
                this.activeRooms.delete(roomID);
            }
        }
    }
}

export const secretMatchmaking = new SecretMatchmaking();
export default secretMatchmaking;
