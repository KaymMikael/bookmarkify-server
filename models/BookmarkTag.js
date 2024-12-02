import pool from "../mysql/sql.js";

class BookMarkTag {
  constructor() {
    if (!BookMarkTag.instance) {
      BookMarkTag.instance = this;
    }
    return BookMarkTag.instance;
  }

  async insertBookMarkTag(bookmark_id, tag_id) {
    const query = "INSERT INTO bookmark_tags VALUES (?, ?);";
    const [result] = await pool.query(query, [bookmark_id, tag_id]);
    return result;
  }
}

const bookMarkTagInstance = new BookMarkTag();

export default bookMarkTagInstance;
