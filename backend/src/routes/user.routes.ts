import { Router } from "express";
import createUser from "../controllers/create-user.controller.js";
import verifyUser from "../controllers/verify-user.controller.js";


const userRoute = Router()
userRoute.post("/gen-user", createUser)
userRoute.post("/verify-user", verifyUser)

export default userRoute