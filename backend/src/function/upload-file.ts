import { appendFileSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { ChunkPayload, type AckCallback } from "../types/index.js";

const uploadFile = async (file: ChunkPayload, ack?: AckCallback): Promise<void> => {
    try {
        const { fileName, chunk, offset, totalSize } = file;

        // Ensure uploads directory exists
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!existsSync(uploadsDir)) {
            mkdirSync(uploadsDir, { recursive: true });
        }

        const uploadPath = path.join(uploadsDir, fileName);

        // Convert chunk to Node.js Buffer and append
        const chunkBuffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk as ArrayBuffer);
        appendFileSync(uploadPath, chunkBuffer);

        const currentSize = offset + chunkBuffer.length;

        // Check if entire file upload is finished
        if (currentSize >= totalSize) {
            console.log(`Finished uploading: ${fileName}`);
            if (typeof ack === 'function') {
                ack({ filePath: uploadPath, success: true, completed: true, progress: 100 });
            }
        } else {
            const progress = Math.round((currentSize / totalSize) * 100);
            if (typeof ack === 'function') {
                ack({ filePath: uploadPath, success: true, completed: false, progress });
            }
        }
    } catch (error) {
        console.error('Error while uploading chunk file:', error);
        if (typeof ack === 'function') {
            ack({
                filePath: "",
                success: false,
                completed: false,
                progress: 0,
                message: 'Chunk upload failed on server',
            });
        }
    }
};


export default uploadFile