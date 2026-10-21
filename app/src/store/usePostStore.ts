import { create } from "zustand"
import socket from "../services/socket-sevice";
//import usePost from "./usePost";

interface UploadAckResponse {
    success: boolean;
    completed: boolean;
    progress: number;
    message?: string;
    filePath: string
}
interface ChunkPayload {
    fileName: string;
    chunk: ArrayBuffer;
    offset: number;
    totalSize: number;
}
interface NewPost {
    content: string
    postMedia: File | null
    isMedia: boolean
    feelings: string
}
interface PostState {
    published: boolean
    isPublishing: boolean;
    isUploading: boolean
    uploadProgress: number
    uploadStatus: string
    message: string
    uploadResponse: UploadAckResponse | null
    publishPost: (newPost: NewPost, callback: (success: boolean) => void) => void;
    uploadFile: (selectedFile: File) => void;
}
const CHUNK_SIZE = 64 * 1024; // 64 KB per chunk (optimal for Socket.IO binary frames)

const usePostStore = create<PostState>((set, get) => ({
    published: false,
    message: "",
    isPublishing: false,
    isUploading: false,
    uploadProgress: 0,
    uploadStatus: "Preparing...",
    uploadResponse: null,


    uploadFile: async (selectedFile: File): Promise<void> => {
        const totalSize = selectedFile.size;
        let offset = 0;
        const ext = selectedFile.name.split(".").pop()
        const uniqueFileName = `media--${Date.now()}.${ext}`;

        try {
            set({ isUploading: true, uploadProgress: 0, uploadStatus: `Uploading started ${get().uploadProgress}%` })
            while (offset < totalSize) {
                // Slice the blob chunk
                const chunkBlob = selectedFile.slice(offset, offset + CHUNK_SIZE);
                const chunkArrayBuffer = await chunkBlob.arrayBuffer();

                const payload: ChunkPayload = {
                    fileName: uniqueFileName,
                    chunk: chunkArrayBuffer,
                    offset,
                    totalSize,
                };

                // Emit chunk and await server acknowledgement via Promise
                const response = await new Promise<UploadAckResponse>((resolve, reject) => {
                    socket.emit('file-upload:chunk', payload, (ack: UploadAckResponse) => {
                        if (ack) {
                            resolve(ack);
                        } else {
                            set({ message: "Failed to published media", isPublishing: false, isUploading: false })
                            reject(new Error('Server failed to acknowledge chunk upload'));
                        }
                    });
                });

                if (!response.success) {
                    set({ message: "Failed to upload media", isPublishing: false, isUploading: false })
                    throw new Error(response.message || 'Chunk upload failed');
                }

                // Update progress UI
                set({ uploadProgress: response.progress, uploadStatus: `Uploading: ${response.progress}%` })
                // Move offset forward
                offset += CHUNK_SIZE;
                if (response.completed) {
                    set({ message: "Post published successfully", uploadResponse: response, uploadProgress: response.progress, uploadStatus: "Upload finished successfully! 🎉" })
                    break;
                }
            }

        } catch (error: any) {
            console.log("Error while uploading file : ", error)
            set({ message: "Error while uploading file media", isPublishing: false, uploadProgress: 0, isUploading: false })
        }
    },
    publishPost: async (newPost: NewPost, callback: (success: boolean) => void): Promise<void> => {
        try {
            set({ message: "", isPublishing: true, published: false })
            if (newPost.isMedia) {
                await get().uploadFile(newPost.postMedia as File)
            }

            const finalPost = {
                post_content: newPost?.content,
                post_feeling: newPost?.feelings || "",
                post_media: get().uploadResponse ? get().uploadResponse?.filePath : ""
            }
            socket.emit("publish-post", finalPost)
            // usePost.getState().fetchPost()
            set({
                message: "Post published successfully",
                published: true,
                uploadProgress: 0,
                uploadStatus: "",
                uploadResponse: null,
                isUploading: false,
                isPublishing: false
            })
            callback(true)
            setTimeout(() => {
                set({ message: "" })
            }, 2000);
        } catch (error) {
            set({ message: "Error while publishing post", isPublishing: false, uploadProgress: 0, isUploading: false })
            console.log(error)

        }
    }
}))

export default usePostStore