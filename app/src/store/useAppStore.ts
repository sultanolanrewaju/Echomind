import { create } from "zustand";
import socket from "../services/socket-sevice";

export interface Notification {
    _id: string;
    sender_id: string;
    receiver_id: string;
    post_id: string;
    text: string;
    time: string;
    read: boolean;
}

export interface AIMessage {
    id: string;
    sender: "bot" | "user";
    text: string;
    time: string;
}

export interface SecretPeer {
    alias: string;
    feeling: string;
    role: string;
    avatar: string;
}

export interface SecretMessage {
    id: string;
    senderID: string;
    senderAlias: string;
    text: string;
    time: string;
    isMe: boolean;
}

interface AppState {
    isAI: boolean;
    isProfile: boolean;
    isNotiOpen: boolean;
    notifications: Notification[];
    onlineCount: number;

    // AI Chat State
    activeChatTab: "ai" | "secret";
    aiMessages: AIMessage[];
    isAITyping: boolean;

    // Secret Chat State
    secretStatus: "idle" | "searching" | "matched" | "ended";
    secretPeer: SecretPeer | null;
    secretRoomID: string | null;
    secretMessages: SecretMessage[];
    secretPeerTyping: boolean;
    isSecretChat: boolean

    // Actions
    openAI: () => void;
    openProfile: () => void;
    openNotification: () => void;
    setOnlineCount: (count: number) => void;
    setActiveChatTab: (tab: "ai" | "secret") => void;

    // Notifications Actions
    handleNotification: (notification: Notification[]) => void;
    readNotification: (notiID: string) => void;
    deleteNotification: (notiID: string) => void;
    clearAllNotifications: () => void;

    // AI Chat Actions
    sendAIMessage: (text: string) => void;
    addAIMessage: (msg: AIMessage) => void;
    setAITyping: (typing: boolean) => void;

    // Secret Chat Actions
    startSecretMatch: (feeling?: string) => void;
    cancelSecretMatch: () => void;
    sendSecretMessage: (text: string) => void;
    leaveSecretChat: () => void;
    setSecretMatched: (roomID: string, peer: SecretPeer) => void;
    setSecretStatus: (status: "idle" | "searching" | "matched" | "ended") => void;
    addSecretMessage: (msg: SecretMessage) => void;
    setSecretPeerTyping: (isTyping: boolean) => void;
    openSecretChat: () => void
}

const useAppStore = create<AppState>((set, get) => ({
    isAI: false,
    isProfile: false,
    isNotiOpen: false,
    notifications: [],
    onlineCount: 1,
    isSecretChat: false,

    // AI Chat
    activeChatTab: "ai",
    aiMessages: [
        {
            id: "initial_bot_msg",
            sender: "bot",
            text: "Hey! How is your health and mood today? I'm Echo Mind, your compassionate listener. If you need someone to talk to, I can also match you with an anonymous peer supporter for a secret chat! 💙🌿",
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
    ],
    isAITyping: false,

    // Secret Chat
    secretStatus: "idle",
    secretPeer: null,
    secretRoomID: null,
    secretMessages: [],
    secretPeerTyping: false,

    openAI: () => set({ isAI: !get().isAI }),
    openProfile: () => set({ isProfile: !get().isProfile }),
    openNotification: () => set({ isNotiOpen: !get().isNotiOpen }),
    setOnlineCount: (count: number) => set({ onlineCount: count }),
    setActiveChatTab: (tab: "ai" | "secret") => set({ activeChatTab: tab }),

    handleNotification: (notification: Notification[]) => {
        set({ notifications: notification || [] });
    },

    readNotification: (notiID: string): void => {
        const { notifications } = get();
        const updatedNoti = notifications.map((noti) => {
            if (noti._id === notiID) {
                return { ...noti, read: true };
            }
            return noti;
        });
        set({ notifications: updatedNoti });
        socket.emit("read-notification", notiID);
    },

    deleteNotification: (notiID: string): void => {
        const { notifications } = get();
        const updatedNoti = notifications.filter((noti) => noti?._id !== notiID);
        set({ notifications: updatedNoti });
        socket.emit("delete-notification", notiID);
    },

    clearAllNotifications: (): void => {
        const { notifications } = get();
        notifications.forEach((n) => socket.emit("delete-notification", n._id));
        set({ notifications: [] });
    },

    // AI Chat
    sendAIMessage: (text: string): void => {
        const trimmed = text.trim();
        if (!trimmed) return;

        const userMsg: AIMessage = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            sender: "user",
            text: trimmed,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        // Append user message safely, avoiding any exact text/time duplicates at the end
        set((state) => {
            const lastMsg = state.aiMessages[state.aiMessages.length - 1];
            if (lastMsg && lastMsg.sender === "user" && lastMsg.text === trimmed) {
                return { isAITyping: true };
            }
            return {
                aiMessages: [...state.aiMessages, userMsg],
                isAITyping: true,
            };
        });

        const history = get().aiMessages.map((m) => ({
            sender: m.sender,
            text: m.text,
        }));

        socket.emit("ai:message", { message: trimmed, history }, (response: any) => {
            if (response?.text) {
                const botMsg: AIMessage = {
                    id: `bot_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                    sender: "bot",
                    text: response.text,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                };

                set((state) => {
                    // Prevent identical bot message content duplication
                    const alreadyExists = state.aiMessages.some(
                        (m) => m.text === botMsg.text && m.sender === "bot" && Date.now() - parseInt(m.id.split('_')[1] || '0') < 5000
                    );
                    if (alreadyExists) return { isAITyping: false };

                    return {
                        aiMessages: [...state.aiMessages, botMsg],
                        isAITyping: false,
                    };
                });
            } else {
                set({ isAITyping: false });
            }
        });
    },

    addAIMessage: (msg: AIMessage): void => {
        set((state) => {
            const exists = state.aiMessages.some((m) => m.id === msg.id || (m.text === msg.text && m.sender === msg.sender));
            if (exists) return state;
            return {
                aiMessages: [...state.aiMessages, msg],
                isAITyping: false,
            };
        });
    },

    setAITyping: (typing: boolean): void => {
        set({ isAITyping: typing });
    },

    // Secret Chat
    startSecretMatch: (feeling?: string): void => {
        set({
            secretStatus: "searching",
            secretPeer: null,
            secretRoomID: null,
            secretMessages: [],
            activeChatTab: "secret",
        });
        socket.emit("secret:find-match", { feeling: feeling || "Normal" });
    },

    cancelSecretMatch: (): void => {
        set({ secretStatus: "idle" });
        socket.emit("secret:cancel-match");
    },

    sendSecretMessage: (text: string): void => {
        const { secretRoomID } = get();
        const trimmed = text.trim();
        if (!secretRoomID || !trimmed) return;
        socket.emit("secret:send-message", { roomID: secretRoomID, text: trimmed });
    },

    leaveSecretChat: (): void => {
        socket.emit("secret:leave-chat");
        set({
            secretStatus: "idle",
            secretPeer: null,
            secretRoomID: null,
            secretMessages: [],
        });
    },

    setSecretMatched: (roomID: string, peer: SecretPeer): void => {
        set({
            secretStatus: "matched",
            secretRoomID: roomID,
            secretPeer: peer,
            activeChatTab: "secret",
            secretMessages: [
                {
                    id: "sys_matched",
                    senderID: "system",
                    senderAlias: "System",
                    text: `Connected with ${peer.alias} (${peer.feeling}). This secret chat is completely anonymous. Share freely! 💙`,
                    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    isMe: false,
                },
            ],
        });
    },

    setSecretStatus: (status: "idle" | "searching" | "matched" | "ended"): void => {
        set({ secretStatus: status });
    },

    addSecretMessage: (msg: SecretMessage): void => {
        set((state) => {
            const exists = state.secretMessages.some(
                (m) => m.id === msg.id || (m.text === msg.text && m.senderID === msg.senderID)
            );
            if (exists) return state;
            return {
                secretMessages: [...state.secretMessages, msg],
            };
        });
    },

    setSecretPeerTyping: (isTyping: boolean): void => {
        set({ secretPeerTyping: isTyping });
    },
    openSecretChat: () => {
        get().openAI()
        get().setActiveChatTab("secret")
    }
}));

export default useAppStore;