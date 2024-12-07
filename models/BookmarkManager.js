import pool from "../mysql/sql.js";

class BookmarkManager {
  constructor() {
    if (!BookmarkManager.instance) {
      BookmarkManager.instance = this;
    }
    return BookmarkManager.instance;
  }

  async #bookmarkExists(bookmark_url, userId) {
    const query =
      "SELECT COUNT(*) AS count FROM bookmarks WHERE bookmark_url = ? AND user_id = ?";
    const [rows] = await pool.query(query, [bookmark_url, userId]);
    return rows[0].count > 0;
  }

  async insertBookMark(values) {
    const [user_id, bookmark_title, bookmark_url, is_public] = values;
    if (await this.#bookmarkExists(bookmark_url, user_id)) {
      throw new Error("Bookmark already exists");
    }
    const query =
      "INSERT INTO bookmarks (user_id, bookmark_title, bookmark_url, is_public) VALUES (?, ?, ?, ?);";
    const [result] = await pool.query(query, values);
    return result;
  }

  async getBookmarksByUserId(userId) {
    const query = `SELECT b.bookmark_id AS bookmark_id, b.bookmark_url, b.bookmark_title, b.is_public, b.user_id, u.user_name, GROUP_CONCAT(t.tag_name) AS tags, b.created_at
                  FROM bookmarks b 
                  JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id 
                  JOIN tags t ON bt.tag_id = t.tag_id
                  JOIN users u ON b.user_id = u.user_id
                  WHERE b.user_id = ?
                  GROUP BY b.bookmark_id
                  ORDER BY b.created_at DESC`;

    const [result] = await pool.query(query, [userId]);

    if (!result.length) {
      return { message: "Bookmark not found" };
    }

    return result.map((data) => ({
      bookmarkId: data.bookmark_id,
      user_id: data.user_id,
      url: data.bookmark_url,
      title: data.bookmark_title,
      isPublic: data.is_public ? true : false,
      author: data.user_name,
      createdAt: data.created_at,
      tags: data.tags ? data.tags.split(",") : [],
    }));
  }

  async getPublicBookmarks() {
    const query = `SELECT b.bookmark_id AS bookmark_id, b.bookmark_url, b.bookmark_title, b.is_public, b.user_id, u.user_name, GROUP_CONCAT(t.tag_name) AS tags, b.created_at
                  FROM bookmarks b 
                  JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id 
                  JOIN tags t ON bt.tag_id = t.tag_id
                  JOIN users u ON b.user_id = u.user_id 
                  WHERE b.is_public = true
                  GROUP BY b.bookmark_id
                  ORDER BY b.created_at DESC`;
    const [result] = await pool.query(query);

    if (!result.length) {
      return { message: "Bookmark not found" };
    }

    return result.map((data) => ({
      bookmarkId: data.bookmark_id,
      user_id: data.user_id,
      url: data.bookmark_url,
      title: data.bookmark_title,
      isPublic: data.is_public ? true : false,
      author: data.user_name,
      createdAt: data.created_at,
      tags: data.tags ? data.tags.split(",") : [],
    }));
  }

  async deleleteById(bookmarkId) {
    const query = "DELETE FROM bookmarks WHERE bookmark_id = ?";
    const [result] = await pool.query(query, [bookmarkId]);

    if (result.affectedRows === 0) {
      throw new Error("Bookmark not found");
    }

    return result;
  }

  async getByTag(tag) {
    const query = `SELECT b.bookmark_id AS bookmark_id, b.bookmark_url, b.bookmark_title, b.is_public, b.user_id, u.user_name, GROUP_CONCAT(t.tag_name) AS tags, b.created_at
                FROM 
                  bookmarks b 
                JOIN 
                  bookmark_tags bt ON b.bookmark_id = bt.bookmark_id 
                JOIN 
                  tags t ON t.tag_id = bt.tag_id 
                JOIN users u ON b.user_id = u.user_id
                WHERE 
                  b.bookmark_id IN (
                    SELECT 
                      b2.bookmark_id 
                    FROM 
                      bookmarks b2 
                    JOIN 
                      bookmark_tags bt2 ON b2.bookmark_id = bt2.bookmark_id 
                    JOIN 
                      tags t2 ON t2.tag_id = bt2.tag_id 
                    WHERE 
                      t2.tag_name LIKE ?
                  )
                GROUP BY 
                  b.bookmark_id;`;

    const [result] = await pool.query(query, [`${tag.replace("-", " ")}%`]);

    //Return this if there are no bookmark
    if (!result.length) {
      return { message: "Bookmark not found" };
    }

    return result.map((data) => ({
      bookmarkId: data.bookmark_id,
      user_id: data.user_id,
      url: data.bookmark_url,
      title: data.bookmark_title,
      isPublic: data.is_public ? true : false,
      author: data.user_name,
      createdAt: data.created_at,
      tags: data.tags ? data.tags.split(",") : [],
    }));
  }

  async getById(bookmarkId) {
    const query = `SELECT b.bookmark_id AS bookmark_id, b.bookmark_url, b.bookmark_title, b.is_public, b.user_id, GROUP_CONCAT(t.tag_name) AS tags, b.created_at
                  FROM bookmarks b 
                  JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id 
                  JOIN tags t ON bt.tag_id = t.tag_id
                  WHERE b.bookmark_id = ?
                  GROUP BY b.bookmark_id`;
    const [result] = await pool.query(query, [bookmarkId]);
    if (!result.length) {
      throw new Error("Bookmark not found");
    }
    return result;
  }

  async editBookmarkById(values) {
    const query =
      "UPDATE bookmarks SET bookmark_title = ?, bookmark_url = ?, is_public = ? WHERE bookmark_id = ?";
    const [result] = await pool.query(query, values);
    return result;
  }
}

const bookMarkInstance = new BookmarkManager();

export default bookMarkInstance;

