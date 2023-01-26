import { Router } from "express";
import authRouter from "./modules/auth/routes/auth.routes";
import usersRouter from "./modules/users/routes/users.routes";

const router = Router();

router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;
