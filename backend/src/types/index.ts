export interface ChunkPayload {
    fileName: string;
    chunk: Buffer;
    offset: number;
    totalSize: number;
}
export interface UploadAckResponse {
    success: boolean;
    completed: boolean;
    progress: number;
    message?: string;
    filePath: string
}
export type AckCallback = (response: UploadAckResponse) => void;
export interface RequestPost {
    post_content: string
    post_feeling: string
    post_media: string
}
