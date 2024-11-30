import { Router } from "express";
import AuthController from "../../controllers/auth/controller.js";

const AuthRouter = Router();

//auth routes
AuthRouter.route("/register").post(AuthController.register);
AuthRouter.route("/login").post(AuthController.login);
AuthRouter.route("/").get(
  AuthController.verifyUser,
  AuthController.authenticateUser
);
AuthRouter.route("/logout").get(AuthController.logout);

export default AuthRouter;
