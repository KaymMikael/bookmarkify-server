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
}

const bookMarkTagInstance = new BookMarkTag();

export default bookMarkTagInstance;
