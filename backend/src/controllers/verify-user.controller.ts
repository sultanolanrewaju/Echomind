import { Request, Response } from "express";



const verifyUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req?.query

        if (!id) {
            console.log("ID not found")
            res.status(404).json({
                success: false,
                message: "User ID Required",
                timestamp: new Date().toISOString()
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "User Verfied Successfully",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.log(error)
        res.status(200).json({
            success: false,
            message: "User Verfied Failed",
            timestamp: new Date().toISOString()
        });
    }
}

export default verifyUser