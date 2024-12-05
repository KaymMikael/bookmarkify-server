import pool from "../mysql/sql.js";

class TagManager {
  constructor() {
    if (!TagManager.instance) {
      TagManager.instance = this;
    }
    return TagManager.instance;
  }

  async #addTag(name) {
    const query = `INSERT INTO tags (tag_name) VALUES (?);`;
    const [result] = await pool.query(query, [name]);
    return result.insertId;
  }

  async #getTagByName(name) {
    const query = "SELECT * FROM tags WHERE tag_name = ?;";
    const [result] = await pool.query(query, [name]);
    return result[0];
  }

  async getTagByTagId(tagId) {
    const query = "SELECT * from tags WHERE tag_id = ?";
    const [result] = await pool.query(query, [tagId]);
    return result;
  }

  async getOrCreateTag(name) {
    let tag = await this.#getTagByName(name);
    if (tag) {
      return tag.tag_id;
    } else {
      const tagId = await this.#addTag(name);
      return tagId;
    }
  }
}

const tagInstance = new TagManager();

export default tagInstance;
