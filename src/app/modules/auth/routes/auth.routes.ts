import { Router } from "express";
import AuthController from "../controllers/auth.controller";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/forgot-password", authController.forgotPassword);

export default authRouter;
