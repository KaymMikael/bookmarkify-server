import { request, response } from "express";
import bookMarkInstance from "../../models/Bookmark.js";
import tagInstance from "../../models/Tag.js";
import bookMarkTagInstance from "../../models/BookmarkTag.js";

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
    const result = await bookMarkTagInstance.getBookmarksByUserId(userId);
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
};

export default bookmarkController;
