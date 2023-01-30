import { Router } from "express";
import multer from "multer";
import uploadConfig from "../../../middlewares/upload";
import verifyToken from "../../../middlewares/verify-token";
import UsersController from "../controllers/users.controller";

const usersRouter = Router();
const usersController = new UsersController();

const upload = multer(uploadConfig);

usersRouter.get("/", verifyToken, usersController.findAll);
usersRouter.get("/:id", verifyToken, usersController.findById);
usersRouter.post("/", verifyToken, usersController.save);
usersRouter.put("/:id", verifyToken, usersController.update);
usersRouter.put(
  "/:id/avatar",
  verifyToken,
  upload.single("avatar"),
  usersController.updateAvatar
);
usersRouter.delete("/:id", verifyToken, usersController.delete);

export default usersRouter;
