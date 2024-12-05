import { Router } from "express";
import bookmarkController from "../../controllers/bookmark/controller.js";
import { verifyToken } from "../../controllers/auth/token.js";

const BookMarkRouter = Router();

BookMarkRouter.route("/").post(verifyToken, bookmarkController.addBookMark);
BookMarkRouter.route("/:userId").get(
  verifyToken,
  bookmarkController.getBookmarkByUserId
);

export default BookMarkRouter;
