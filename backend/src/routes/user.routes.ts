import { Router } from "express";
import createUser from "../controllers/create-user.controller.js";
import verifyUser from "../controllers/verify-user.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import isCookie from "../middlewares/is-cookie.js";

const userRoute = Router();
userRoute.post("/gen-user", createUser);
userRoute.post("/verify-user", isCookie, verifyUser);
userRoute.get("/posts", getPosts);

export default userRoute;