import { create } from "zustand"
import socket from "../services/socket-sevice"
import useAPI from "./useAPI"
import api from "../libs/axios-api"

export interface Profile {
    totalPost: number
    followers: number
    reactions: number
}
type Comment = {
    commenter_id: string
    comment: string
    time: string
}
export type Post = {
    _id: string;
    __v: number;
    createdAt: string;
    updatedAt: string;
    likes: string[];
    comments: Comment[]
    shares: string[];
    post_content: string;
    post_feeling: string;
    post_media?: string;
    poster_id: string;
}

interface ManagePostState {
    totalPost: number;
    all_post: Post[];
    hasMore: boolean;
    isLoading: boolean;
    profile: Profile | null;
    isOpenComment: boolean;
    selectedPost: Post | null;

    setPost: (data: any) => void;
    addNewPost: (newPost: Post) => void;
    setAllPost: (posts: any) => void;
    fetchPost: () => void;
    setUserProfile: (data: Profile) => void;
    toggleLike: (postID: string) => void;
    updatePostLikes: (postID: string, likes: string[]) => void;
    isLiked: (postID: string) => boolean;
    openComment: (post: Post | null) => void;
    createComment: (comment: string) => void;
    addPostComment: (postID: string, comment: Comment, allComments?: Comment[]) => void;
    getPost: () => void
}

const usePost = create<ManagePostState>((set, get) => ({
    totalPost: 0,
    all_post: [],
    hasMore: true,
    isLoading: false,
    profile: null,
    isOpenComment: false,
    selectedPost: null,

    setPost: (data: any) => {
        if (!data?.post) return;
        const { all_post } = get();
        if (!all_post.some((p) => p._id === data.post._id)) {
            set({ all_post: [data.post, ...all_post] });
        }
    },
    addNewPost: (newPost: Post) => {
        if (!newPost?._id) return;
        const { all_post } = get();
        if (!all_post.some((p) => p._id === newPost._id)) {
            set({ all_post: [newPost, ...all_post] });
        }
    },
    updatePostLikes: (postID: string, likes: string[]) => {
        const { all_post, selectedPost } = get();
        const updated = all_post.map((p) => (p._id === postID ? { ...p, likes } : p));
        set({ all_post: updated });
        if (selectedPost && selectedPost._id === postID) {
            set({ selectedPost: { ...selectedPost, likes } });
        }
    },
    addPostComment: (postID: string, comment: Comment, allComments?: Comment[]) => {
        const { all_post, selectedPost } = get();
        const updated = all_post.map((p) => {
            if (p._id === postID) {
                const comments = allComments || [...(p.comments || []), comment];
                return { ...p, comments };
            }
            return p;
        });
        set({ all_post: updated });
        if (selectedPost && selectedPost._id === postID) {
            const comments = allComments || [...(selectedPost.comments || []), comment];
            set({ selectedPost: { ...selectedPost, comments } });
        }
    },
    setAllPost: (posts) => {
        set({ all_post: posts })
    },
    fetchPost: () => {
        const { isLoading, hasMore, all_post } = get();

        // Prevent fetching if already loading or no more posts exist
        if (isLoading || !hasMore) return;

        set({ isLoading: true });

        socket.emit("fetch-post", { limit: 5, skip: all_post.length }, (response: any) => {
            try {
                // Added fallbacks in case your backend uses 'posts' instead of 'latestPost'
                const posts: Post[] = response?.latestPost || response?.posts || [];
                const total = response?.totalPost ?? response?.total;

                // Determine if there are no more posts to fetch
                const noMore = posts.length === 0 || posts.length < 5 || (total !== undefined && all_post.length + posts.length >= total);

                set({
                    all_post: [...all_post, ...posts],
                    hasMore: !noMore,
                    isLoading: false
                });
                console.log("response post : ", response?.latestPost)
            } catch (error) {
                console.error("Failed to process fetched posts:", error);
                // Always reset isLoading so the app doesn't break permanently on error
                set({ isLoading: false });
            }
        });
    },
    setUserProfile: (data: Profile) => {
        set({ profile: data })
    },
    isLiked: (postID: string): boolean => {
        const apiState = useAPI.getState ? useAPI.getState() : undefined
        const user = apiState?.user
        const selectedPost = get().all_post.filter((post) => post._id === postID)
        if (selectedPost?.length == 1) {
            if (selectedPost[0].likes.includes(user?.user_id as string)) {
                return true
            } else {
                return false
            }
        }
        return false
    },
    toggleLike: (postID: string) => {
        const apiState = useAPI.getState ? useAPI.getState() : undefined;
        const user = apiState?.user;

        // Ensure user is logged in before proceeding
        if (!user || !user.user_id) return;
        const userID = user.user_id;

        const { isLiked, all_post } = get();
        const alreadyLiked = isLiked(postID);

        // Map through posts to find and update the target post immutably
        const updatedPosts = all_post.map((post) => {
            // Adjust '_id' or 'id' based on your database schema
            if (post._id === postID || post._id === postID) {
                const currentLikes = post.likes || [];

                return {
                    ...post,
                    likes: alreadyLiked
                        ? currentLikes.filter((id: string) => id !== userID) // Unlike
                        : [...currentLikes, userID] // Like
                };
            }
            return post;
        });

        // Update the store state
        set({ all_post: updatedPosts });
        socket.emit("handle-like", postID)
    },
    openComment: (post: Post | null) => {
        set({ isOpenComment: !get().isOpenComment, selectedPost: post })
    },
    createComment: (comment: string): void => {
        if (!comment) return

        const { selectedPost, all_post } = get()
        const apiState = useAPI.getState ? useAPI.getState() : undefined;
        const user = apiState?.user;
        if (!user || !user.user_id) return;
        const userID = user.user_id;

        const tempComment: Comment = {
            commenter_id: userID,
            comment, time: Date()
        }

        const updatedPosts = all_post.map((post) => {
            if (post._id === selectedPost?._id || post._id === selectedPost?._id) {
                const currentComments = post.comments || [];

                return {
                    ...post,
                    comments: [...currentComments, tempComment]
                };
            }
            return post;
        });
        set({ all_post: updatedPosts })
        set({ selectedPost: updatedPosts.filter((post) => post._id === selectedPost?._id)[0] })
        socket.emit("create-comment", selectedPost?._id, tempComment)
    },
    getPost: async () => {
        try {
            set({ isLoading: true })
            const url = "/api/posts";
            const response = await api.get(url);
            if (response?.data?.posts?.length > 0) {
                set({ all_post: response?.data?.posts, isLoading: false })
            } else {
                set({ all_post: [], isLoading: false })
            }
        } catch (error) {
            set({ isLoading: false })
            console.log("Faild to get post : ", error)
        }
    }
}))

export default usePost