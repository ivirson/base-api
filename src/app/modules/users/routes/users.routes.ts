import { Router } from "express";
import verifyToken from "../../../middlewares/verify-token";
import UsersController from "../controllers/users.controller";

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get("/", verifyToken, usersController.findAll);
usersRouter.get("/:id", verifyToken, usersController.findById);
usersRouter.post("/", verifyToken, usersController.save);
usersRouter.put("/:id", verifyToken, usersController.update);
usersRouter.delete("/:id", verifyToken, usersController.delete);

export default usersRouter;
