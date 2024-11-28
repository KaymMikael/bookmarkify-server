import { Router } from "express";
import UserController from "../../controllers/user/controller.js";

const UserRouter = Router();

//auth routes
UserRouter.route("/auth/register").post(UserController.register);
UserRouter.route("/auth/login").post(UserController.login);
UserRouter.route("/auth").get(
  UserController.verifyUser,
  UserController.authenticateUser
);

export default UserRouter;
