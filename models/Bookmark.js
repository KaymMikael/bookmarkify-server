import pool from "../mysql/sql.js";

class BookMark {
  constructor() {
    if (!BookMark.instance) {
      BookMark.instance = this;
    }
    return BookMark.instance;
  }
  async #bookmarkExists(bookmark_url) {
    const query =
      "SELECT COUNT(*) AS count FROM bookmarks WHERE bookmark_url = ?";
    const [rows] = await pool.query(query, [bookmark_url]);
    return rows[0].count > 0;
  }
  async insertBookMark(values) {
    const [user_id, bookmark_title, bookmark_url, is_public] = values;
    if (await this.#bookmarkExists(bookmark_url)) {
      throw new Error("Bookmark already exists");
    }
    const query =
      "INSERT INTO bookmarks (user_id, bookmark_title, bookmark_url, is_public) VALUES (?, ?, ?, ?);";
    const [result] = await pool.query(query, values);
    return result;
  }
}

const bookMarkInstance = new BookMark();

export default bookMarkInstance;