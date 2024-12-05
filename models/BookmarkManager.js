import pool from "../mysql/sql.js";

class BookmarkManager {
  constructor() {
    if (!BookMark.instance) {
      BookMark.instance = this;
    }
    return BookMark.instance;
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
    const query = `SELECT b.bookmark_id AS bookmark_id, b.bookmark_url, b.bookmark_title, b.is_public, GROUP_CONCAT(t.tag_name) AS tags, b.created_at
                  FROM bookmarks b 
                  JOIN bookmark_tags bt ON b.bookmark_id = bt.bookmark_id 
                  JOIN tags t ON bt.tag_id = t.tag_id 
                  WHERE b.user_id = ?
                  GROUP BY b.bookmark_id;`;

    const [result] = await pool.query(query, [userId]);

    if (!result.length) {
      return { message: "No bookmark found" };
    }
    return result.map((data) => ({
      bookmarkId: data.bookmark_id,
      url: data.bookmark_url,
      title: data.bookmark_title,
      isPublic: data.is_public ? true : false,
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
}

const bookMarkInstance = new BookmarkManager();

export default bookMarkInstance;
