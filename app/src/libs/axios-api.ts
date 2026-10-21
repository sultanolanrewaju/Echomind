import axios from "axios";

// Priority: VITE_API_URL env variable -> localhost in dev -> deployed render URL
export const url =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.DEV
        ? "http://localhost:3000"
        : "https://echo-mind-zd7k.onrender.com");

const api = axios.create({
    baseURL: url,
    withCredentials: true,
});

// Use a request interceptor to dynamically get the token on every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("echomind-token");
        if (token) {
            config.headers["authcookie"] = token;
            config.headers["authCookie"] = token;
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;