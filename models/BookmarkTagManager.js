import pool from "../mysql/sql.js";

class BookmarkTagManager {
  constructor() {
    if (!BookmarkTagManager.instance) {
      BookmarkTagManager.instance = this;
    }
    return BookmarkTagManager.instance;
  }

  async insertBookMarkTag(bookmark_id, tag_id) {
    const query = "INSERT INTO bookmark_tags VALUES (?, ?);";
    const [result] = await pool.query(query, [bookmark_id, tag_id]);
    return result;
  }

  async deleteById(bookmarkId) {
    const query = "DELETE FROM bookmark_tags WHERE bookmark_id = ?;";
    const [result] = await pool.query(query, [bookmarkId]);

    if (result.affectedRows === 0) {
      throw new Error("Bookmark not found");
    }
  }
}

const bookMarkTagInstance = new BookmarkTagManager();

export default bookMarkTagInstance;
