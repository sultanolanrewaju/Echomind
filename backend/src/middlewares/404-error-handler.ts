import { Request, Response } from "express";


const notFoundError = (_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "ERROR : Route Not Found - 404" });
}

export default notFoundError