import { create } from "zustand"
import api from "../libs/axios-api"
import parsedUser from "../tools/parse-user"

type Follower = {
    user_id: string
}
export type User = {
    user_id: string | null
    user_device_token: string
    user_ip: string
    user_agent: string
    user_country: string
    user_followers: Follower[]
    user_feeling: string
    active_status: boolean
}

interface APIState {
    user: User | null
    isCreatingUser: boolean
    isVerifying: boolean
    isDark: boolean
    theme: string

    navigate: null | any
    initializeUser: (navigate: any) => void
    verifyUser: (inavigate: any) => void
    setUser: (newUser: User) => void
    toggleTheme: () => void
}

const getInitialUser = (): User | null => {
    try {
        const raw = localStorage.getItem("echomind-user");
        if (raw && raw !== "undefined" && raw !== "null") {
            return JSON.parse(raw);
        }
    } catch {
        return null;
    }
    return null;
};

const echomind_user: User | null = getInitialUser();
const theme = localStorage.getItem("theme");

const useAPI = create<APIState>((set, get) => ({
    user: echomind_user,
    isCreatingUser: false,
    isVerifying: true,
    navigate: null,
    theme: theme || "light",
    isDark: theme === "dark",

    initializeUser: async (navigate): Promise<void> => {
        try {
            set({ isCreatingUser: true })
            const url = "/api/gen-user";
            const response = await api.post(url);
            if (response?.data?.success) {
                localStorage.setItem("echomind-user", JSON.stringify(response?.data?.user));
                localStorage.setItem("echomind-token", response?.data?.token);
                set({ user: response?.data?.user })
                setTimeout(() => {
                    navigate("/news-feed")
                    set({ isCreatingUser: false })
                }, 100);
            } else {
                set({ isCreatingUser: false })
                navigate("/internal-server-error")
            }
        } catch (error) {
            set({ isCreatingUser: false })
            navigate("/internal-server-error")
            console.error("Error While Creating User : ", error);
            throw error;
        }
    },
    verifyUser: async (navigate): Promise<boolean> => {
        try {
            set({ isVerifying: true, navigate: navigate })
            const url = "/api/verify-user";
            const response = await api.post(url);
            if (response?.data?.success) {
                setTimeout(() => {
                    set({ user: parsedUser(response?.data?.user), isVerifying: false })
                }, 100);
                return true
            } else {
                navigate("/unauthorized-access")
                set({ isVerifying: false })
                return false
            }
        } catch (error) {
            set({ isVerifying: false })
            navigate("/internal-server-error")
            console.log("Error While Verifying User : ", error)
            return false
        }
    },
    setUser: (newUser) => set({ user: newUser }),
    toggleTheme: () => {
        const currentTheme = get().theme// document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            set({ theme: "light", isDark: false })
            localStorage.setItem("theme", "light")
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            set({ theme: "dark", isDark: true })
            localStorage.setItem("theme", "dark")
        }
    }
}))

export default useAPI




