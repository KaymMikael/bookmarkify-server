import { Router } from "express";
import UserController from "../../controllers/user/controller.js";

const UserRouter = Router();

UserRouter.route("/auth/register").post(UserController.registerUser);

export default UserRouter;
