import { Router } from "express";
import bookmarkController from "../../controllers/bookmark/controller.js";

const BookMarkRouter = Router();

BookMarkRouter.route("/").post(bookmarkController.addBookMark);
BookMarkRouter.route("/:userId").get(bookmarkController.getBookmarkByUserId);

export default BookMarkRouter;
