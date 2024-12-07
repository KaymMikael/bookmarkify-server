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

const getBookmarksByTag = async (req = request, res = response) => {
  const { tag } = req.query;
  try {
    const result = await bookMarkInstance.getByTag(tag);
    res.status(200).json(result);
    return;
  } catch (e) {
    console.log(`ERROR: ${e}`);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const getBookmarkByBookmarkId = async (req = request, res = response) => {
  const { bookmarkId } = req.params;
  try {
    const result = await bookMarkInstance.getById(bookmarkId);
    res.status(200).json(result[0]);
    return;
  } catch (error) {
    if (error.message === "Bookmark not found") {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

/* updating algo
update title, url, is public

check the tags one by one
if tag is linked to the bookmark
	keep
if tag is not linked
	create new or get and linked */
const editBookmarkByBookmarkId = async (req = request, res = response) => {
  const { bookmarkId, userId, title, url, isPublic, tags } = req.body;
  if (!userId || !title || !url || !tags || !tags.length) {
    res.status(400).json({ error: "Please provide all require fields" });
    return;
  }

  try {
    //Update bookmark
    await bookMarkInstance.editBookmarkById([
      title,
      url,
      isPublic,
      parseInt(bookmarkId),
    ]);

    //Delete delete bookmarktags
    await bookMarkTagInstance.deleteById(parseInt(bookmarkId));

    //Add the new bookmarktags
    for (let i = 0; i < tags.length; i++) {
      const tagId = await tagInstance.getOrCreateTag(tags[i]);
      await bookMarkTagInstance.insertBookMarkTag(parseInt(bookmarkId), tagId);
    }

    res.status(204).json({ message: "Bookmark successfully updated" });
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

const bookmarkController = {
  addBookMark,
  getBookmarkByUserId,
  deleteBookmark,
  getPublicBookmarks,
  getBookmarksByTag,
  getBookmarkByBookmarkId,
  editBookmarkByBookmarkId,
};

export default bookmarkController;
