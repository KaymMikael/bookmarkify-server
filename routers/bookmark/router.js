import { Router } from "express";
import bookmarkController from "../../controllers/bookmark/controller.js";
import { verifyToken } from "../../controllers/auth/token.js";

const BookMarkRouter = Router();

BookMarkRouter.route("/").post(verifyToken, bookmarkController.addBookMark);
BookMarkRouter.route("/").get(
  verifyToken,
  bookmarkController.getPublicBookmarks
);
BookMarkRouter.route("/tag").get(
  verifyToken,
  bookmarkController.getBookmarksByTag
);
BookMarkRouter.route("/:userId/user-bookmarks").get(
  verifyToken,
  bookmarkController.getBookmarkByUserId
);
BookMarkRouter.route("/:bookmarkId").get(
  verifyToken,
  bookmarkController.getBookmarkByBookmarkId
);
BookMarkRouter.route("/").put(
  verifyToken,
  bookmarkController.editBookmarkByBookmarkId
);
BookMarkRouter.route("/:bookmarkId").delete(
  verifyToken,
  bookmarkController.deleteBookmark
);

export default BookMarkRouter;
