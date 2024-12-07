import { request, response } from "express";
import bookMarkInstance from "../../models/BookmarkManager.js";
import tagInstance from "../../models/TagManager.js";
import bookMarkTagInstance from "../../models/BookmarkTagManager.js";

const addBookMark = async (req = request, res = response) => {
  const { userId, title, url, isPublic, tags } = req.body;

  if (!userId || !title || !url) {
    res.status(400).json({ error: "Please provide all require fields" });
    return;
  }

  try {
    const values = [userId, title, url, isPublic];
    const newBookmark = await bookMarkInstance.insertBookMark(values);

    for (let i = 0; i < tags.length; i++) {
      const tagId = await tagInstance.getOrCreateTag(tags[i]);
      await bookMarkTagInstance.insertBookMarkTag(newBookmark.insertId, tagId);
    }

    res.status(201).json({ message: "Bookmark Successfully Created" });
    return;
  } catch (e) {
    console.error(e);
    if (e.message === "Bookmark already exists") {
      return res.status(409).json({ error: "Bookmark already exists" });
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getBookmarkByUserId = async (req = request, res = response) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "Parameter is empty" });
  }

  try {
    const result = await bookMarkInstance.getBookmarksByUserId(userId);
    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const deleteBookmark = async (req = request, res = response) => {
  const { bookmarkId } = req.params;

  if (!bookmarkId) {
    res.status(400).json({ error: "Parameter is empty" });
    return;
  }

  try {
    await bookMarkTagInstance.deleteById(bookmarkId);
    await bookMarkInstance.deleleteById(bookmarkId);

    res.status(204).json({ message: "Bookmark deleted" });
    return;
  } catch (e) {
    console.log(e);
    if (e.message === `Bookmark not found`) {
      res.status(404).json({ error: e.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getPublicBookmarks = async (req = request, res = response) => {
  try {
    const result = await bookMarkInstance.getPublicBookmarks();

    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const bookmarkController = {
  addBookMark,
  getBookmarkByUserId,
  deleteBookmark,
  getPublicBookmarks,
};

export default bookmarkController;
