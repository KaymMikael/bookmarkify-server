import { Router } from "express";
import bookmarkController from "../../controllers/bookmark/controller.js";

const BookMarkRouter = Router();

BookMarkRouter.route("/").post(bookmarkController.addBookMark);

export default BookMarkRouter;
