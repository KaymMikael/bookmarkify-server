import { Router } from "express";
import AuthController from "../../controllers/auth/controller.js";

const AuthRouter = Router();

//auth routes
AuthRouter("/register").post(AuthController.register);
AuthRouter("/login").post(AuthController.login);
AuthRouter("/").get(AuthController.verifyUser, AuthController.authenticateUser);

export default AuthRouter;
