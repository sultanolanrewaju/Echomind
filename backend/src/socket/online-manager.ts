import { Server, Socket } from "socket.io";
import { UserModel } from "../models/user.model.js";

class OnlineManager {
    // Map of userID -> Set of socket IDs
    private userSockets: Map<string, Set<string>> = new Map();
    // Map of socketID -> userID
    private socketToUser: Map<string, string> = new Map();
    // In-memory cache of user details for quick matching
    private userDetails: Map<string, { feeling: string; country: string }> = new Map();

    public addUserSocket(userID: string, socket: Socket, feeling = "Normal", country = "Global"): { isFirstConnection: boolean } {
        const socketID = socket.id;
        this.socketToUser.set(socketID, userID);

        let sockets = this.userSockets.get(userID);
        const isFirstConnection = !sockets || sockets.size === 0;

        if (!sockets) {
            sockets = new Set();
            this.userSockets.set(userID, sockets);
        }
        sockets.add(socketID);
        this.userDetails.set(userID, { feeling, country });

        return { isFirstConnection };
    }

    public removeUserSocket(socketID: string): { userID: string | null; isLastConnection: boolean } {
        const userID = this.socketToUser.get(socketID);
        if (!userID) {
            return { userID: null, isLastConnection: false };
        }

        this.socketToUser.delete(socketID);
        const sockets = this.userSockets.get(userID);
        if (sockets) {
            sockets.delete(socketID);
            if (sockets.size === 0) {
                this.userSockets.delete(userID);
                this.userDetails.delete(userID);
                return { userID, isLastConnection: true };
            }
        }

        return { userID, isLastConnection: false };
    }

    public getOnlineCount(): number {
        return this.userSockets.size;
    }

    public getOnlineUserIDs(): string[] {
        return Array.from(this.userSockets.keys());
    }

    public isUserOnline(userID: string): boolean {
        const sockets = this.userSockets.get(userID);
        return Boolean(sockets && sockets.size > 0);
    }

    public getUserSockets(userID: string): string[] {
        const sockets = this.userSockets.get(userID);
        return sockets ? Array.from(sockets) : [];
    }

    public getUserDetails(userID: string) {
        return this.userDetails.get(userID) || { feeling: "Normal", country: "Global" };
    }

    public setUserFeeling(userID: string, feeling: string) {
        const curr = this.userDetails.get(userID);
        if (curr) {
            curr.feeling = feeling;
        } else {
            this.userDetails.set(userID, { feeling, country: "Global" });
        }
    }

    public broadcastOnlineStats(io: Server) {
        const count = this.getOnlineCount();
        io.emit("online:stats", {
            onlineCount: count,
            timestamp: new Date().toISOString(),
        });
    }

    public async markUserStatusInDB(userID: string, active: boolean): Promise<void> {
        try {
            await UserModel.updateOne(
                { user_id: userID },
                { $set: { active_status: active } }
            );
        } catch (err) {
            console.error(`Failed to update user active status in DB for ${userID}:`, err);
        }
    }
}

export const onlineManager = new OnlineManager();
export default onlineManager;
